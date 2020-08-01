const Playlist = require('../models/Playlist');

exports.getPlaylistByUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'User is not logged in'
      });
    }
    const userId = req.user.id;
    let playlist = await Playlist.findOne({ user: userId });
    if (!playlist) {
      playlist = new Playlist({
        user: userId,
        movies: []
      });
      playlist = await playlist.save();
      playlist = await playlist.populate('user').execPopulate();
    }
    return res.json(playlist);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};

exports.addMovieToPlaylist = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'User is not logged in'
      });
    }
    const userId = req.user.id;
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ error: 'Movie to add not found' });
    }
    const playlist = await Playlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { movies: movieId } },
      { new: true }
    );
    if (!playlist) {
      return res.status(400).json({ error: 'Playlist not found' });
    }
    return res.json(playlist);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};

exports.removeMovieFromPlaylist = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: 'User is not logged in'
      });
    }
    const userId = req.user.id;
    const { movieId } = req.body;
    if (!movieId) {
      return res.status(400).json({ error: 'Movie to add not found' });
    }
    const playlist = await Playlist.findOneAndUpdate(
      { user: userId },
      { $pull: { movies: movieId } },
      { new: true }
    );
    if (!playlist) {
      return res.status(400).json({ error: 'Playlist not found' });
    }
    return res.json(playlist);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};
