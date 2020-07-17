const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  userId: {
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

playlistSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('Playlist', playlistSchema);
