const express = require('express');
const router = express.Router();
const passport = require('passport');

const Playlist = require('../models/Playlist');
const { runValidation } = require('../utils/middleware/validators');
const {
  playlistsValidator
} = require('../utils/middleware/validators/playlists');

const { getPlaylist } = require('../utils/service/playlist');
// router.get(
//   '/playlists',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     try {
//       const playlists = await Playlist.find();
//       return res.json(playlists);
//     } catch (e) {
//       return res.status(400).json({
//         error: e.message
//       });
//     }
//   }
// );

router.get(
  '/playlists/byUser',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(400).json({
          error: 'User is not logged in'
        });
      }
      const { id } = req.user;
      let playlist = await Playlist.findOne({ userId: id });
      if (!playlist) {
        playlist = new Playlist({
          userId: id,
          movies: []
        });
        playlist = await playlist.save();
      }
      return res.json(playlist);
    } catch (e) {
      return res.status(400).json({
        error: e.message
      });
    }
  }
);

router.put(
  '/playlists/addMovie',
  passport.authenticate('jwt', { session: false }),
  playlistsValidator,
  runValidation,
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(400).json({
          error: 'User is not logged in'
        });
      }
      const { id } = req.user;
      const { movieId } = req.body;
      if (!movieId) {
        return res.status(400).json({ error: 'Movie to add not found' });
      }
      const _playlist = await Playlist.findOneAndUpdate(
        { userId: id },
        { $addToSet: { movies: movieId } },
        { new: true }
      );
      if (!_playlist) {
        return res.status(400).json({ error: 'Playlist not found' });
      }
      const { error, playlist } = await getPlaylist(id);
      if (error) {
        return res.status(400).json({
          error
        });
      }
      return res.json(playlist);
    } catch (e) {
      return res.status(400).json({
        error: e.message
      });
    }
  }
);

module.exports = router;
