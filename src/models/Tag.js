const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 32,
    unique: true
  }
});

tagSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Tag', tagSchema);
