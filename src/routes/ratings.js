const express = require('express');
const router = express.Router();
const passport = require('passport');

// Validators
const { runValidation } = require('../utils/middleware/validators');
const { ratingsValidator } = require('../utils/middleware/validators/ratings');
// Controller
const ratingController = require('../controllers/ratingController');

router.get(
  '/ratings',
  passport.authenticate('jwt', { session: false }),
  ratingController.getRatings
);

router.get(
  '/ratings/:id',
  passport.authenticate('jwt', { session: false }),
  ratingController.getRatingById
);

router.post(
  '/ratings',
  passport.authenticate('jwt', { session: false }),
  ratingsValidator,
  runValidation,
  ratingController.createRating
);

module.exports = router;
