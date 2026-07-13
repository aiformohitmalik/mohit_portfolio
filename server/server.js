import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Inquiry } from './models/Inquiry.js';
import { chatHandler } from './routes/chat.js';
import { sendInquiryEmail } from './utils/mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const DATA_DIR = join(__dirname, 'data');
const DATA_FILE = join(DATA_DIR, 'inquiries.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Explicit origin allowlist — no wildcard subdomains
const allowedOrigins = [
  'https://mohit--malik.vercel.app',
  'https://mohit-portfolio-inky-two.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser (curl, mobile)
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS policy block: origin ${origin} not allowed.`), false);
  },
  credentials: true
}));
app.use(express.json({ limit: '16kb' }));

const distPath = join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('/', (req, res) => {
  res.json({
    message: "👋 Welcome to Mohit's Portfolio Server",
    status: 'online',
    endpoints: { health: '/api/health', inquiries: { get: 'GET /api/inquiries', post: 'POST /api/inquiries' } }
  });
});

let isMongoConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚠️  No MONGO_URI or MONGODB_URI found in env. Falling back to local JSON storage.');
    return;
  }
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri);
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️  Falling back to local JSON storage.');
  }
};

const ensureDataDirExists = async () => {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch (_) {}
};

const saveToLocalJson = async (inquiryData) => {
  await ensureDataDirExists();
  let inquiries = [];
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    inquiries = JSON.parse(data);
  } catch (_) {}
  const newInquiry = { id: Date.now().toString(), ...inquiryData, createdAt: new Date().toISOString() };
  inquiries.push(newInquiry);
  await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2));
  return newInquiry;
};

const getFromLocalJson = async () => {
  await ensureDataDirExists();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (_) { return []; }
};

// ── In-memory rate limiter for contact form (10 req / 10 min per IP) ──────────
const inquiryRateLimitMap = new Map();
const INQUIRY_WINDOW_MS = 10 * 60 * 1000;
const INQUIRY_MAX = 10;

function isInquiryRateLimited(ip) {
  const now = Date.now();
  const recent = (inquiryRateLimitMap.get(ip) || []).filter(ts => now - ts < INQUIRY_WINDOW_MS);
  inquiryRateLimitMap.set(ip, recent);
  if (recent.length >= INQUIRY_MAX) return true;
  recent.push(now);
  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of inquiryRateLimitMap.entries()) {
    const recent = timestamps.filter(ts => now - ts < INQUIRY_WINDOW_MS);
    if (!recent.length) inquiryRateLimitMap.delete(ip);
    else inquiryRateLimitMap.set(ip, recent);
  }
}, 5 * 60 * 1000);

// ── Weather: IP geo → OpenWeatherMap ─────────────────────────────────────────
const weatherCache = new Map(); // ip → { data, expiresAt }
const WEATHER_TTL  = 15 * 60 * 1000; // 15 min

function owmIdToKey(id) {
  if (id >= 200 && id < 300) return 'thunderstorm';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 700 && id < 800) return 'fog';
  if (id === 800)             return 'clear';
  if (id > 800)               return 'cloudy';
  return 'rain';
}

app.get('/api/weather', async (req, res) => {
  const ip = (req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '').replace('::ffff:', '');

  // Serve from cache
  const cached = weatherCache.get(ip);
  if (cached && Date.now() < cached.expiresAt) return res.json(cached.data);

  try {
    // 1. IP → lat/lon (ip-api.com — free, no key, 45 req/min)
    const isLocal = !ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168') || ip.startsWith('10.');
    let lat, lon, city, country;

    if (isLocal) {
      // Default to portfolio owner's city for local dev
      lat = 28.8955; lon = 76.6066; city = 'Rohtak'; country = 'India';
    } else {
      const geoRes  = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,lat,lon`);
      const geoData = await geoRes.json();
      if (geoData.status !== 'success') throw new Error('geo lookup failed');
      ({ lat, lon, city, country } = geoData);
    }

    // 2. lat/lon → weather (OpenWeatherMap free tier)
    const owmKey = process.env.OPENWEATHER_API_KEY;
    if (!owmKey) {
      const data = { weather: 'rain', city, country };
      weatherCache.set(ip, { data, expiresAt: Date.now() + WEATHER_TTL });
      return res.json(data);
    }

    const owmRes  = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${owmKey}`);
    const owmData = await owmRes.json();
    const condId  = owmData.weather?.[0]?.id ?? 800;
    const data    = { weather: owmIdToKey(condId), city, country };

    weatherCache.set(ip, { data, expiresAt: Date.now() + WEATHER_TTL });
    res.json(data);
  } catch {
    res.json({ weather: 'rain', city: null, country: null });
  }
});

// Prune weather cache every 30 min
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of weatherCache.entries()) {
    if (now >= entry.expiresAt) weatherCache.delete(key);
  }
}, 30 * 60 * 1000);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: isMongoConnected ? 'mongodb' : 'local_json_fallback',
    timestamp: new Date().toISOString()
  });
});

// ── Mannu AI chatbot ──────────────────────────────────────────────────────────
app.post('/api/chat', chatHandler);

// ── POST /api/inquiries ───────────────────────────────────────────────────────
app.post('/api/inquiries', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  if (isInquiryRateLimited(ip)) {
    return res.status(429).json({ success: false, error: 'Too many submissions. Please wait before trying again.' });
  }

  const { name, email, organization, purpose, message } = req.body;

  if (!name || !email || !purpose || !message) {
    return res.status(400).json({ success: false, error: 'Please provide name, email, purpose, and message.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
  }

  const allowedPurposes = ['Recruitment', 'Collaboration', 'Consultation', 'General Inquiry'];
  if (!allowedPurposes.includes(purpose)) {
    return res.status(400).json({ success: false, error: 'Invalid purpose classification.' });
  }

  try {
    let savedInquiry;
    if (isMongoConnected) {
      const inquiry = new Inquiry({ name, email, organization, purpose, message });
      savedInquiry = await inquiry.save();
      console.log(`💼 Saved inquiry from ${name} to MongoDB.`);
    } else {
      savedInquiry = await saveToLocalJson({ name, email, organization, purpose, message });
      console.log(`💾 Saved inquiry from ${name} to local JSON.`);
    }
    sendInquiryEmail({ name, email, organization, purpose, message })
      .catch(err => console.error('Email notification failed:', err.message));
    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully. Connection established.',
      data: savedInquiry
    });
  } catch (err) {
    console.error('Error handling inquiry submission:', err);
    res.status(500).json({ success: false, error: 'Failed to process inquiry. Please try again later.' });
  }
});

// ── GET /api/inquiries (admin only) ──────────────────────────────────────────
app.get('/api/inquiries', async (req, res) => {
  const token = req.headers['x-admin-token'];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }

  try {
    let inquiries;
    if (isMongoConnected) {
      inquiries = await Inquiry.find().sort({ createdAt: -1 });
    } else {
      inquiries = await getFromLocalJson();
      inquiries.reverse();
    }
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err) {
    console.error('Error retrieving inquiries:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve inquiries.' });
  }
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  const indexPath = join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) res.status(404).json({ error: 'Not Found', path: req.path });
  });
});

// ── Startup & graceful shutdown ───────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🤖 Mannu AI: Groq ${process.env.GROQ_API_KEY ? '✅' : '❌'}  Gemini ${process.env.GEMINI_API_KEY ? '✅' : '❌'}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

const shutdown = async () => {
  console.log('⚠️ Received shutdown signal, cleaning up...');
  try {
    await mongoose.connection.close();
    console.log('Mongoose connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

startServer();
