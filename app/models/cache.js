'use strict';

const mongoose = require('mongoose');

const cacheSchema = mongoose.Schema({
  name: String,
  location: String,
  latitude: Number,
  longitude: Number,
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const Cache = mongoose.model('Cache', cacheSchema);
module.exports = Cache;
