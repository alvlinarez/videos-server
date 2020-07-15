const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    }
  ]
});

module.exports = mongoose.model('Playlist', playlistSchema);
