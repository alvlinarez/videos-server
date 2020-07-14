const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env'); // env variables

// Validators
const { runValidation } = require('../utils/middleware/validators');
const {
  userSignInValidator,
  userSignUpValidator
} = require('../utils/middleware/validators/auth');

// Sign up route
router.post('/signup', userSignUpValidator, runValidation, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        error: 'Email already exists.'
      });
    }
    user = new User({ name, email, password });
    try {
      await user.save();
      return res.status(200).json({
        message: 'Sign up success. Please sign in.'
      });
    } catch (e) {
      return res.status(401).json({
        error: 'Error creating user. Try signing up again.'
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Sign in route
// Basic Strategy
require('../utils/auth/strategies/basic');
router.post('/signin', (req, res) => {
  passport.authenticate('basic', (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: err.error
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.error
        });
      }
      const { _id: id, name, email } = user;
      const payload = {
        sub: id,
        name,
        email
      };
      const token = jwt.sign(payload, config.jwtSecret, {
        expiresIn: '7d'
      });
      res.cookie('token', token, {
        httpOnly: config.env !== 'development',
        secure: config.env !== 'development'
      });
      return res.status(200).json({
        token,
        user: {
          id,
          name,
          email
        }
      });
    });
  })(req, res);
});

const customSignIn = (req, res) => {
  return (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: err.error
      });
    }
    const { ...data } = user;
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(400).json({
          error: err.error
        });
      }
      res.cookie('token', data.token, {
        httpOnly: config.env !== 'development',
        secure: config.env !== 'development'
      });
      return res.status(200).json({
        token: data.token,
        user: data.user
      });
    });
  };
};
// Facebook Strategy
require('../utils/auth/strategies/facebook');
router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/auth/facebook/callback', (req, res) => {
  passport.authenticate('facebook', customSignIn(req, res))(req, res);
});

// Google Strategy
require('../utils/auth/strategies/google');
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile', 'openid'] })
);

router.get('/auth/google/callback', (req, res) => {
  passport.authenticate('google', customSignIn(req, res))(req, res);
});

module.exports = router;
