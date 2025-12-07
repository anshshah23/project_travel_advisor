const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure Mongoose for serverless
mongoose.set('strictQuery', false);
mongoose.set('bufferCommands', false); // Disable buffering

let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedDb;
  }

  try {
    // Close any existing connections first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    const opts = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
    };

    cachedDb = await mongoose.connect(process.env.MONGODB_URI, opts);
    console.log('MongoDB connected successfully');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    cachedDb = null;
    throw error;
  }
};

// Routes
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');

// Health check - test connection
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    
    // Test actual database operation
    await mongoose.connection.db.admin().ping();
    
    res.json({ 
      status: 'ok', 
      message: 'Travel Advisor API is running',
      mongoStatus: 'connected',
      readyState: mongoose.connection.readyState,
      database: mongoose.connection.name
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      message: 'Travel Advisor API is running',
      mongoStatus: 'disconnected',
      readyState: mongoose.connection.readyState,
      error: error.message
    });
  }
});

// Connect to DB before handling routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({ error: 'Database connection failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;