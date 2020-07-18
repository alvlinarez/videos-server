const express = require('express');
const router = express.Router();
const passport = require('passport');

// Validators
const { runValidation } = require('../utils/middleware/validators');
const { moviesValidator } = require('../utils/middleware/validators/movies');

// Controller
const movieController = require('../controllers/movieController');

router.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  movieController.getMovies
);

router.get(
  '/movies/:id',
  passport.authenticate('jwt', { session: false }),
  movieController.getMovieById
);

router.post(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  moviesValidator,
  runValidation,
  movieController.createMovie
);

module.exports = router;
