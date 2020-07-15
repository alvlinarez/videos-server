const express = require('express');
const router = express.Router();
const passport = require('passport');

const Rating = require('../models/Rating');
const { runValidation } = require('../utils/middleware/validators');
const { ratingsValidator } = require('../utils/middleware/validators/ratings');

router.get(
  '/ratings',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const ratings = await Rating.find();
      return res.json(ratings);
    } catch (e) {
      return res.status(400).json({
        error: e.message
      });
    }
  }
);

router.post(
  '/ratings',
  passport.authenticate('jwt', { session: false }),
  ratingsValidator,
  runValidation,
  async (req, res) => {
    try {
      const { name } = req.body;
      let rating = await Rating.findOne({ name });
      if (rating) {
        return res.status(400).json({
          error: 'Rating with that name already exists'
        });
      }
      rating = new Rating({ name });
      rating = await rating.save();
      return res.json(rating);
    } catch (e) {
      return res.status(400).json({
        error: e.message
      });
    }
  }
);

module.exports = router;
