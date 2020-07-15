const express = require('express');
const router = express.Router();
const passport = require('passport');

const Movie = require('../models/Movie');

router.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const movies = await Movie.find();
      return res.json(movies);
    } catch (e) {
      return res.status(400).json({
        error: e.message
      });
    }
  }
);

router.get(
  '/movies/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const movieId = req.params.id;
    if (!movieId) {
      return res.status(400).json({
        error: 'movieId not found'
      });
    }
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(400).json({
        error: 'Movie not found'
      });
    }
    return res.json(movie);
  }
);

module.exports = router;
