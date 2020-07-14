const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');

// Passport Jwt Strategy
require('../utils/auth/strategies/jwt');

router.get(
  '/user/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        error: 'userId not found'
      });
    }
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({
          error: 'User not found'
        });
      }
      const { _id: id, name, email, createdAt, updatedAt } = user;
      return res.json({
        id,
        name,
        email,
        createdAt,
        updatedAt
      });
    } catch (e) {
      return res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
);

module.exports = router;
