const express = require('express');
const router = express.Router();
const passport = require('passport');

const { runValidation } = require('../utils/middleware/validators');
const { tagsValidator } = require('../utils/middleware/validators/tags');
// Controller
const tagController = require('../controllers/tagController');

router.get(
  '/tags',
  passport.authenticate('jwt', { session: false }),
  tagController.getTags
);

router.get(
  '/tags/:id',
  passport.authenticate('jwt', { session: false }),
  tagController.getTagById
);

router.post(
  '/tags',
  passport.authenticate('jwt', { session: false }),
  tagsValidator,
  runValidation,
  tagController.createTag
);

module.exports = router;
