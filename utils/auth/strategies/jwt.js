const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../../../models/User');

const config = require('../../../config/env');

const passportJwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

passport.use(
  new Strategy(passportJwtOptions, async (tokenPayload, done) => {
    try {
      let user = await User.findOne({ email: tokenPayload.email });
      if (!user) {
        return done({ error: 'User not found.' }, false);
      }
      user = await user.toJSON();
      return done(null, user);
    } catch (e) {
      return done({ error: e.message });
    }
  })
);
