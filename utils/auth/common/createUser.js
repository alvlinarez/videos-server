const jwt = require('jsonwebtoken');

const User = require('../../../models/User');
const config = require('../../../config/env');

exports.createUser = async (user) => {
  user = new User({
    name: user.name,
    email: user.email,
    password: user.password
  });
  try {
    user = await user.save();
    user = user.toJSON();
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email
    };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: '7d'
    });
    return { res: { user, token } };
  } catch (e) {
    return { error: e.message };
  }
};
