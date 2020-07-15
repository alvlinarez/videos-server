const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    max: 80,
    unique: true
  },
  year: {
    type: Number,
    required: true,
    min: 1888,
    max: 2077
  },
  cover: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    max: 300
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 3000
  },
  contentRating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  },
  source: {
    type: String,
    required: true
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ]
});

movieSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Movie', movieSchema);
