const express = require('express');
const router = express.Router();
const passport = require('passport');
const { runValidation } = require('../utils/middleware/validators');

const Tag = require('../models/Tag');
const { tagsValidator } = require('../utils/middleware/validators/tags');

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

router.post(
  '/tags',
  passport.authenticate('jwt', { session: false }),
  tagsValidator,
  runValidation,
  async (req, res) => {
    try {
      const { name } = req.body;
      let tag = await Tag.findOne({ name });
      if (tag) {
        return res.status(400).json({
          error: 'Tag with that name already exists'
        });
      }
      tag = new Tag({ name });
      tag = await tag.save();
      return res.json(tag);
    } catch (e) {
      return res.status(400).json({
        error: e.message
      });
    }
  }
);

module.exports = router;
