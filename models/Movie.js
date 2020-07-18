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

// Method to fill tags and ratings
const autoPopulate = function (next) {
  this.populate([
    {
      path: 'tags'
    },
    {
      path: 'contentRating'
    }
  ]);
  next();
};

movieSchema
  .pre('find', autoPopulate)
  .pre('findOne', autoPopulate)
  .pre('findOneAndUpdate', autoPopulate)
  .pre('findById', autoPopulate);

movieSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Movie', movieSchema);
