const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32
  }
});

module.exports = mongoose.model('Tag', tagSchema);
