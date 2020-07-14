const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../../../models/User');
const jwt = require('jsonwebtoken');

const config = require('../../../config/env');

const facebookOptions = {
  clientID: config.facebookClientId,
  clientSecret: config.facebookClientSecret,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'email', 'first_name', 'last_name']
};

passport.use(
  new FacebookStrategy(
    facebookOptions,
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email, first_name, last_name } = profile._json;
        if (!email) {
          return done({ error: 'Error verifying facebook token' });
        }
        try {
          let user = await User.findOne({ email });
          if (user) {
            user = user.toObject();
            const { _id, email, name } = user;
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
              name: first_name + ' ' + last_name,
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
        return done({ error: e.message });
      }
    }
  )
);
