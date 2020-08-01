const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 5
  }
});

ratingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Rating', ratingSchema);
