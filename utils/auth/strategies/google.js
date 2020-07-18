const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

const config = require('../../../config/env');
const User = require('../../../models/User');
const { createUser } = require('../common/createUserOauth');

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
            user = user.toJSON();
            const payload = {
              sub: user.id,
              name,
              email
            };
            const token = jwt.sign(payload, config.jwtSecret, {
              expiresIn: '7d'
            });
            return done(null, { user, token });
          } else {
            user = {
              name,
              email,
              password: email + config.jwtSecret
            };
            const { res, error } = await createUser(user);
            if (error) {
              return done({ error });
            }
            return done(null, res);
            // user = new User({
            //   name,
            //   email,
            //   password
            // });
            // try {
            //   user = await user.save();
            //   user = user.toJSON();
            //   const payload = {
            //     sub: user.id,
            //     name,
            //     email
            //   };
            //   const token = jwt.sign(payload, config.jwtSecret, {
            //     expiresIn: '7d'
            //   });
            //   return done(null, { user, token });
            // } catch (e) {
            //   return done({ error: e.message });
            // }
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
