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

const { createUser } = require('../common/createUser');

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
            user = await user.toJSON();
            const payload = {
              sub: user.id,
              name: user.name,
              email
            };
            const token = jwt.sign(payload, config.jwtSecret, {
              expiresIn: '7d'
            });
            return done(null, { user, token });
          } else {
            user = {
              name: first_name + ' ' + last_name,
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
            //
            //
            //   return done(null, { user, token });
            // } catch (e) {
            //   return done({ error: e.message });
            // }
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
