const express = require('express');
const router = express.Router();
const passport = require('passport');

// Validators
const { runValidation } = require('../utils/middleware/validators');
const { userSignUpValidator } = require('../utils/middleware/validators/auth');

// Controllers
const authController = require('../controllers/authController');

// Sign up route
router.post(
  '/auth/signup',
  userSignUpValidator,
  runValidation,
  authController.signUpUser
);

// Sign in route
// Basic Strategy
require('../utils/auth/strategies/basic');
router.post('/auth/signin', authController.signInUser);

// Facebook Strategy
require('../utils/auth/strategies/facebook');
router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/auth/facebook/callback', (req, res) => {
  passport.authenticate('facebook', authController.customSignIn(req, res))(
    req,
    res
  );
});

// Google Strategy
require('../utils/auth/strategies/google');
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile', 'openid'] })
);

router.get('/auth/google/callback', (req, res) => {
  passport.authenticate('google', authController.customSignIn(req, res))(
    req,
    res
  );
});

module.exports = router;
