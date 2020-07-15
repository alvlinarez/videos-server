const express = require('express');
const router = express.Router();
const passport = require('passport');

const Rating = require('../models/Rating');

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

module.exports = router;
