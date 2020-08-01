const express = require('express');
const router = express.Router();
const passport = require('passport');

// Controller
const userController = require('../controllers/userController');

// Passport Jwt Strategy
require('../utils/auth/strategies/jwt');

router.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  userController.getUser
);

module.exports = router;
