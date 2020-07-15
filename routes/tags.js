const express = require('express');
const router = express.Router();
const passport = require('passport');

const Tag = require('../models/Tag');

router.get(
  '/tags',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const tags = await Tag.find();
      return res.json(tags);
    } catch (e) {
      return res.status(400).json({
        error: e.message
      });
    }
  }
);

module.exports = router;
