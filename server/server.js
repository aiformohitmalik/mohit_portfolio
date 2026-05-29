import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Inquiry } from './models/Inquiry.js';

// Setup environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, 'data');
const DATA_FILE = join(DATA_DIR, 'inquiries.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors({
  origin: '*', // Allows all origins for local testing and deployment
}));
app.use(express.json());

// State variables
let isMongoConnected = false;

// Attempt to connect to MongoDB
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚠️  No MONGODB_URI found in env. Falling back to local JSON storage.');
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

// Local storage helpers
const ensureDataDirExists = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore if directory exists
  }
};

const saveToLocalJson = async (inquiryData) => {
  await ensureDataDirExists();
  let inquiries = [];
  
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    inquiries = JSON.parse(data);
  } catch (err) {
    // File doesn't exist yet, start with empty list
  }
  
  const newInquiry = {
    id: Date.now().toString(),
    ...inquiryData,
    createdAt: new Date().toISOString()
  };
  
  inquiries.push(newInquiry);
  await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2));
  return newInquiry;
};

const getFromLocalJson = async () => {
  await ensureDataDirExists();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: isMongoConnected ? 'mongodb' : 'local_json_fallback',
    timestamp: new Date().toISOString()
  });
});

// POST /api/inquiries - Submit an inquiry
app.post('/api/inquiries', async (req, res) => {
  const { name, email, organization, purpose, message } = req.body;

  // Basic validation
  if (!name || !email || !purpose || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide name, email, purpose, and message.' 
    });
  }

  const allowedPurposes = ['Recruitment', 'Collaboration', 'Consultation', 'General Inquiry'];
  if (!allowedPurposes.includes(purpose)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid purpose classification.' 
    });
  }

  try {
    let savedInquiry;
    
    if (isMongoConnected) {
      // Save to MongoDB
      const inquiry = new Inquiry({ name, email, organization, purpose, message });
      savedInquiry = await inquiry.save();
      console.log(`💼 Saved inquiry from ${name} to MongoDB.`);
    } else {
      // Save to Local JSON File
      savedInquiry = await saveToLocalJson({ name, email, organization, purpose, message });
      console.log(`💾 Saved inquiry from ${name} to Local JSON file.`);
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully. Connection established.',
      data: savedInquiry
    });
  } catch (err) {
    console.error('Error handling inquiry submission:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process inquiry. Please try again later.' 
    });
  }
});

// GET /api/inquiries - Retrieve inquiries (for validation/dashboard purposes)
app.get('/api/inquiries', async (req, res) => {
  try {
    let inquiries;
    
    if (isMongoConnected) {
      inquiries = await Inquiry.find().sort({ createdAt: -1 });
    } else {
      inquiries = await getFromLocalJson();
      inquiries.reverse(); // Newest first
    }
    
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (err) {
    console.error('Error retrieving inquiries:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve inquiries.' 
    });
  }
});

// Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await connectDB();
});
