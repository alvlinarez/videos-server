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
//   '/playlists/:id',
//   passport.authenticate('jwt', { session: false }),
//   async (req, res) => {
//     const id = req.params.id;
//     try {
//       const playlists = await Playlist.findOne({ _id: id });
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
      const userId = req.user.id;
      let playlist = await Playlist.findOne({ user: userId });
      if (!playlist) {
        playlist = new Playlist({
          user: userId,
          movies: []
        });
        playlist = await playlist.save();
        //playlist = await playlist.populateFields();
        playlist = await playlist.populate('user').execPopulate();
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
  }
);

router.put(
  '/playlists/removeMovie',
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
  }
);

module.exports = router;
