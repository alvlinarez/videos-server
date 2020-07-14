const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const User = require('../../../models/User');

passport.use(
  new BasicStrategy(async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done({ error: 'User not found.' }, false);
      }
      if (!user.authenticate(password)) {
        return done({ error: 'Incorrect password.' }, false);
      }
      user.id = user._id;
      delete user._id;
      delete user.hashedPassword;
      return done(null, user);
    } catch (e) {
      return done({ error: e.message });
    }
  })
);
