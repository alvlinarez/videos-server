const express = require('express');
const router = express.Router();
const passport = require('passport');

const Movie = require('../models/Movie');
const { runValidation } = require('../utils/middleware/validators');
const { moviesValidator } = require('../utils/middleware/validators/movies');

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

router.post(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  moviesValidator,
  runValidation,
  async (req, res) => {
    try {
      const { title, year, cover, description, duration, source } = req.body;
      let movie = await Movie.findOne({ title });
      if (movie) {
        return res.status(400).json({
          error: 'Movie with that name already exists'
        });
      }
      movie = new Movie({
        title,
        year,
        cover,
        description,
        duration,
        source,
        contentRating: '5f0f760a9b9b9b3984dbc728',
        tags: ['5f0f25da2b1a3623e4840578', '5f0f25b22b1a3623e4840577']
      });
      movie = await movie.save();
      return res.json(movie);
    } catch (e) {
      return res.status(400).json({
        error: e.message
      });
    }
  }
);

module.exports = router;
