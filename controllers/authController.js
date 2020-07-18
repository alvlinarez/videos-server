const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config/env');
const User = require('../models/User');

exports.signUpUser = async (req, res) => {
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
};

exports.signInUser = (req, res) => {
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
      const { id, name, email } = user;
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
};

exports.customSignIn = (req, res) => {
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
