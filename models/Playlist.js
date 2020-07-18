const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      unique: true
    }
  ]
});

// Method to fill movies with tags and contentRating and user fields
const autoPopulate = function (next) {
  this.populate([
    {
      path: 'movies',
      populate: 'tags contentRating'
    },
    {
      path: 'user'
    }
  ]);
  next();
};

playlistSchema
  .pre('find', autoPopulate)
  .pre('findOne', autoPopulate)
  .pre('findOneAndUpdate', autoPopulate);

playlistSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Playlist', playlistSchema);
