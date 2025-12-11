const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  locationName: String,
  lat: Number,
  lon: Number,
  searchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchHistory', searchSchema);
