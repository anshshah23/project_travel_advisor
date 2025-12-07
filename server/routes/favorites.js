const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('./auth');

const router = express.Router();

// Get all favorites
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to favorites
router.post('/add', verifyToken, async (req, res) => {
  try {
    const {
      geoId,
      name,
      photo,
      rating,
      numReviews,
      priceLevel,
      address,
      phone,
      website,
      latitude,
      longitude,
    } = req.body;

    if (!geoId || !name) {
      return res.status(400).json({ error: 'geoId and name are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already in favorites
    const alreadyFavorited = user.favorites.some(fav => fav.geoId === geoId);
    if (alreadyFavorited) {
      return res.status(400).json({ error: 'Place already in favorites' });
    }

    // Add to favorites
    user.favorites.push({
      geoId,
      name,
      photo,
      rating,
      numReviews,
      priceLevel,
      address,
      phone,
      website,
      latitude,
      longitude,
    });

    await user.save();

    res.json({
      message: 'Added to favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove from favorites
router.delete('/remove/:geoId', verifyToken, async (req, res) => {
  try {
    const { geoId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove from favorites
    user.favorites = user.favorites.filter(fav => fav.geoId !== geoId);
    await user.save();

    res.json({
      message: 'Removed from favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if place is favorited
router.get('/check/:geoId', verifyToken, async (req, res) => {
  try {
    const { geoId } = req.params;

    // Check if userId was set by verifyToken middleware
    if (!req.userId) {
      console.error('UserId not found in request');
      return res.status(401).json({ error: 'Invalid authentication' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      console.error('User not found in database:', req.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    const isFavorited = user.favorites.some(fav => fav.geoId === geoId);
    res.json({ isFavorited });
  } catch (error) {
    console.error('Check favorite error details:', {
      message: error.message,
      stack: error.stack,
      userId: req.userId,
      geoId: req.params.geoId
    });
    res.status(500).json({ 
      error: 'Server error', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

module.exports = router;
