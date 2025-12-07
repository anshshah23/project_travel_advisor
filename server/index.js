const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    isConnected = false;
  }
};

// Connect on startup
connectDB();

// Routes
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

// Health check - ensure DB connection
app.get('/api/health', async (req, res) => {
  try {
    await connectDB(); // Ensure connection before checking status
    
    res.json({ 
      status: 'ok', 
      message: 'Travel Advisor API is running',
      mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      readyState: mongoose.connection.readyState // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    });
  } catch (error) {
    res.json({ 
      status: 'ok', 
      message: 'Travel Advisor API is running',
      mongoStatus: 'disconnected',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;