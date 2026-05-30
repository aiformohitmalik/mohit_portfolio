// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import { promises as fs } from 'fs';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import { spawn } from 'child_process';
// import { Inquiry } from './models/Inquiry.js';

// // Setup file paths first
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Setup environment variables with explicit path
// dotenv.config({ path: join(__dirname, '.env') });

// const DATA_DIR = join(__dirname, 'data');
// const DATA_FILE = join(DATA_DIR, 'inquiries.json');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Enable CORS and JSON parsing
// app.use(cors({
//   origin: '*', // Allows all origins for local testing and deployment
// }));
// app.use(express.json());

// // Serve static files from dist folder (for production builds)
// const distPath = join(__dirname, '../dist');
// app.use(express.static(distPath));

// // Root endpoint
// app.get('/', (req, res) => {
//   res.json({
//     message: '👋 Welcome to Mohit\'s Portfolio Server',
//     status: 'online',
//     endpoints: {
//       health: '/api/health',
//       inquiries: {
//         get: 'GET /api/inquiries',
//         post: 'POST /api/inquiries'
//       }
//     }
//   });
// });

// // State variables
// let isMongoConnected = false;

// // Attempt to connect to MongoDB
// const connectDB = async () => {
//   const mongoUri = process.env.MONGODB_URI;
//   if (!mongoUri) {
//     console.log('⚠️  No MONGODB_URI found in env. Falling back to local JSON storage.');
//     return;
//   }

//   try {
//     mongoose.set('strictQuery', false);
//     await mongoose.connect(mongoUri);
//     isMongoConnected = true;
//     console.log('✅ Connected to MongoDB successfully.');
//   } catch (error) {
//     console.error('❌ MongoDB Connection Error:', error.message);
//     console.log('⚠️  Falling back to local JSON storage.');
//   }
// };

// // Local storage helpers
// const ensureDataDirExists = async () => {
//   try {
//     await fs.mkdir(DATA_DIR, { recursive: true });
//   } catch (err) {
//     // Ignore if directory exists
//   }
// };

// const saveToLocalJson = async (inquiryData) => {
//   await ensureDataDirExists();
//   let inquiries = [];
  
//   try {
//     const data = await fs.readFile(DATA_FILE, 'utf8');
//     inquiries = JSON.parse(data);
//   } catch (err) {
//     // File doesn't exist yet, start with empty list
//   }
  
//   const newInquiry = {
//     id: Date.now().toString(),
//     ...inquiryData,
//     createdAt: new Date().toISOString()
//   };
  
//   inquiries.push(newInquiry);
//   await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2));
//   return newInquiry;
// };

// const getFromLocalJson = async () => {
//   await ensureDataDirExists();
//   try {
//     const data = await fs.readFile(DATA_FILE, 'utf8');
//     return JSON.parse(data);
//   } catch (err) {
//     return [];
//   }
// };

// // API Routes

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'online',
//     database: isMongoConnected ? 'mongodb' : 'local_json_fallback',
//     timestamp: new Date().toISOString()
//   });
// });

// // POST /api/inquiries - Submit an inquiry
// app.post('/api/inquiries', async (req, res) => {
//   const { name, email, organization, purpose, message } = req.body;

//   // Basic validation
//   if (!name || !email || !purpose || !message) {
//     return res.status(400).json({ 
//       success: false, 
//       error: 'Please provide name, email, purpose, and message.' 
//     });
//   }

//   const allowedPurposes = ['Recruitment', 'Collaboration', 'Consultation', 'General Inquiry'];
//   if (!allowedPurposes.includes(purpose)) {
//     return res.status(400).json({ 
//       success: false, 
//       error: 'Invalid purpose classification.' 
//     });
//   }

//   try {
//     let savedInquiry;
    
//     if (isMongoConnected) {
//       // Save to MongoDB
//       const inquiry = new Inquiry({ name, email, organization, purpose, message });
//       savedInquiry = await inquiry.save();
//       console.log(`💼 Saved inquiry from ${name} to MongoDB.`);
//     } else {
//       // Save to Local JSON File
//       savedInquiry = await saveToLocalJson({ name, email, organization, purpose, message });
//       console.log(`💾 Saved inquiry from ${name} to Local JSON file.`);
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Inquiry received successfully. Connection established.',
//       data: savedInquiry
//     });
//   } catch (err) {
//     console.error('Error handling inquiry submission:', err);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to process inquiry. Please try again later.' 
//     });
//   }
// });

// // GET /api/inquiries - Retrieve inquiries (for validation/dashboard purposes)
// app.get('/api/inquiries', async (req, res) => {
//   try {
//     let inquiries;
    
//     if (isMongoConnected) {
//       inquiries = await Inquiry.find().sort({ createdAt: -1 });
//     } else {
//       inquiries = await getFromLocalJson();
//       inquiries.reverse(); // Newest first
//     }
    
//     res.json({
//       success: true,
//       count: inquiries.length,
//       data: inquiries
//     });
//   } catch (err) {
//     console.error('Error retrieving inquiries:', err);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to retrieve inquiries.' 
//     });
//   }
// });

// // SPA fallback - serve index.html for unmatched routes (for React Router)
// app.use((req, res) => {
//   const indexPath = join(distPath, 'index.html');
//   res.sendFile(indexPath, (err) => {
//     if (err) {
//       // If index.html doesn't exist (development), send a simple 404
//       res.status(404).json({
//         error: 'Not Found',
//         message: 'The requested resource was not found',
//         path: req.path
//       });
//     }
//   });
// });

// const startServer = async () => {
//   try {
//     const server = app.listen(PORT, async () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//       await connectDB();
      
//       // Start ngrok tunnel for public exposure
//       startNgrokTunnel();
//     });
//   } catch (error) {
//     console.error('❌ Server startup failed:', error);
//     process.exit(1);
//   }
// };

// // Global variable to store ngrok process
// let ngrokProcess = null;

// // Function to start ngrok tunnel via CLI
// const startNgrokTunnel = () => {
//   try {
//     // Kill existing ngrok process if any
//     if (ngrokProcess) {
//       ngrokProcess.kill();
//     }
    
//     const ngrok = spawn('ngrok', ['http', PORT.toString(), '--log=stdout']);
//     ngrokProcess = ngrok;
//     let urlDisplayed = false;
    
//     ngrok.stdout.on('data', (data) => {
//       const output = data.toString();
      
//       // Look for the public URL in ngrok output
//       const urlMatch = output.match(/url=(https:\/\/[a-z0-9-]+\.ngrok(?:-free)?\.dev)/i);
//       if (urlMatch && !urlDisplayed) {
//         const publicUrl = urlMatch[1];
//         console.log('\n✨ Public URL (via ngrok):');
//         console.log(`   ${publicUrl}`);
//         console.log('\n🔗 Your server is now publicly accessible!\n');
//         urlDisplayed = true;
//       }
//     });
    
//     ngrok.stderr.on('data', (data) => {
//       const error = data.toString();
//       if (error.toLowerCase().includes('error') && !error.includes('deprecated')) {
//         console.error('⚠️  ngrok error:', error.trim());
//       }
//     });
    
//     ngrok.on('close', (code) => {
//       if (code !== 0 && code !== null) {
//         console.log('\n⚠️  ngrok tunnel closed');
//       }
//     });
    
//   } catch (err) {
//     console.error('❌ Failed to start ngrok tunnel:', err.message);
//     console.log('💡 Make sure ngrok is installed: https://ngrok.com/download\n');
//   }
// };

// // Handle graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('⚠️  Received SIGTERM, cleaning up...');
//   if (ngrokProcess) {
//     ngrokProcess.kill();
//   }
//   process.exit(0);
// });

// process.on('SIGINT', () => {
//   console.log('⚠️  Received SIGINT, cleaning up...');
//   if (ngrokProcess) {
//     ngrokProcess.kill();
//   }
//   // Don't exit here, let the server continue
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.error('❌ Uncaught Exception:', err);
//   if (ngrokProcess) {
//     ngrokProcess.kill();
//   }
//   process.exit(1);
// });

// startServer();


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Inquiry } from './models/Inquiry.js';

// Setup file paths first
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup environment variables with explicit path
dotenv.config({ path: join(__dirname, '.env') });

const DATA_DIR = join(__dirname, 'data');
const DATA_FILE = join(DATA_DIR, 'inquiries.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
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
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow explicit matches or dynamic Vercel preview branch deployments
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy block: origin ${origin} not allowed.`), false);
  },
  credentials: true
}));
app.use(express.json());

// Serve static files from dist folder (for production builds)
const distPath = join(__dirname, '../dist');
app.use(express.static(distPath));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '👋 Welcome to Mohit\'s Portfolio Server',
    status: 'online',
    endpoints: {
      health: '/api/health',
      inquiries: {
        get: 'GET /api/inquiries',
        post: 'POST /api/inquiries'
      }
    }
  });
});

// State variables
let isMongoConnected = false;

// Attempt to connect to MongoDB
const connectDB = async () => {
  // Checks both variations to prevent environment naming bugs
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

// GET /api/inquiries - Retrieve inquiries
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

// SPA fallback - serve index.html for unmatched routes
app.use((req, res) => {
  const indexPath = join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
        path: req.path
      });
    }
  });
});

// Ensure database connection is completely resolved BEFORE server acts on interface traffic
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// Handle clean database termination on runtime environment terminations
// const shutdown = () => {
//   console.log('⚠️  Received shutdown signal, cleaning up resources...');
//   mongoose.connection.close(() => {
//     console.log('Mongoose default connection disconnected.');
//     process.exit(0);
//   });
// };

// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.error('❌ Uncaught Exception:', err);
//   process.exit(1);
// });
// Update your shutdown block to this:
const shutdown = async () => {
  console.log('⚠️ Received shutdown signal, cleaning up resources...');
  try {
    await mongoose.connection.close();
    console.log('Mongoose default connection disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('Error during database disconnection:', err);
    process.exit(1);
  }
};

startServer();