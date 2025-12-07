const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favorites: [{
    geoId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    photo: String,
    rating: Number,
    numReviews: Number,
    priceLevel: String,
    address: String,
    phone: String,
    website: String,
    latitude: Number,
    longitude: Number,
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  supabaseUserId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

module.exports = mongoose.model('User', userSchema);
