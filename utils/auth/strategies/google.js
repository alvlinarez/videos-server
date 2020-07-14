const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');

const config = require('../../../config/env');

const googleOptions = {
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: '/api/auth/google/callback'
};

passport.use(
  new GoogleStrategy(
    googleOptions,
    async (accessToken, refreshToken, { _json: profile }, done) => {
      try {
        const { name, email } = profile;
        if (!email) {
          return done({ error: 'Error verifying facebook token' });
        }
        try {
          let user = await User.findOne({ email });
          if (user) {
            user = user.toObject();
            const { _id } = user;
            const payload = {
              sub: _id,
              name,
              email
            };
            user.id = user._id;
            delete user._id;
            delete user.hashedPassword;
            const token = jwt.sign(payload, config.jwtSecret, {
              expiresIn: '7d'
            });
            return done(null, { user, token });
          } else {
            let password = email + config.jwtSecret;
            user = new User({
              name,
              email,
              password
            });
            try {
              user = await user.save();
              user = user.toObject();
              const { _id, name } = user;
              const payload = {
                sub: _id,
                name,
                email
              };
              user.id = user._id;
              delete user._id;
              delete user.hashedPassword;
              const token = jwt.sign(payload, config.jwtSecret, {
                expiresIn: '7d'
              });
              return done(null, { user, token });
            } catch (e) {
              return done({ error: e.message });
            }
          }
        } catch (e) {
          return done({ error: e.message });
        }
      } catch (e) {
        done({ error: e.message });
      }
    }
  )
);
