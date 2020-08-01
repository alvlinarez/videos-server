const express = require('express');
const router = express.Router();
const passport = require('passport');

// Validators
const { runValidation } = require('../utils/middleware/validators');
const {
  playlistsValidator
} = require('../utils/middleware/validators/playlists');

// Controller
const playlistController = require('../controllers/playlistController');

router.get(
  '/playlists/byUser',
  passport.authenticate('jwt', { session: false }),
  playlistController.getPlaylistByUser
);

router.put(
  '/playlists/addMovie',
  passport.authenticate('jwt', { session: false }),
  playlistsValidator,
  runValidation,
  playlistController.addMovieToPlaylist
);

router.put(
  '/playlists/removeMovie',
  passport.authenticate('jwt', { session: false }),
  playlistsValidator,
  runValidation,
  playlistController.removeMovieFromPlaylist
);

module.exports = router;
