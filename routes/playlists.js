const express = require('express');
const router = express.Router();
const passport = require('passport');

const Playlist = require('../models/Playlist');

router.get(
  '/playlists',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const playlists = await Playlist.find();
      return res.json(playlists);
    } catch (e) {
      return res.status(400).json({
        error: e.message
      });
    }
  }
);

router.get(
  '/playlists/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const movieId = req.params.id;
    if (!movieId) {
      return res.status(400).json({
        error: 'movieId not found'
      });
    }
    const movie = await Playlist.findById(movieId);
    if (!movie) {
      return res.status(400).json({
        error: 'Playlist not found'
      });
    }
    return res.json(movie);
  }
);

module.exports = router;
