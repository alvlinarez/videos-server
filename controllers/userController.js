const User = require('../models/User');

exports.getUser = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({
      error: 'userId not found'
    });
  }
  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    user = await user.toJSON();
    return res.json(user);
  } catch (e) {
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};
