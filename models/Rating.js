const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 5
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
