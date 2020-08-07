const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config/env');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendGridApiKey);
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
    const token = jwt.sign(
      {
        name,
        email,
        password
      },
      config.jwtAccountActivation,
      { expiresIn: '10m' }
    );
    const emailData = {
      from: config.emailFrom,
      to: email,
      subject: `Account activation link`,
      html: `
        <h1>Please use the following link to activate your account</h1>
        <p>${config.clientUrl}auth/account-activation/verify?token=${token}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>${config.clientUrl}</p> 
      `
    };
    try {
      await sgMail.send(emailData);
      return res.json({
        message: `Email has been sent to ${email}. 
        Follow the instructions to activate your account.`
      });
    } catch (e) {
      return res.json({
        message: e.message
      });
    }
  } catch (e) {
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, config.jwtAccountActivation, async function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: 'Expired link. Signup again'
        });
      }
      if (decoded) {
        const { name, email, password } = jwt.decode(token);
        const user = new User({ name, email, password });
        try {
          await user.save();
          return res.status(200).json({
            message: 'Sign up success. Please sign in. Redirecting...'
          });
        } catch (e) {
          return res.status(401).json({
            error: 'Error creating user. Try signing up again.'
          });
        }
      }
    });
  } else {
    return res.status(500).json({
      message: 'Something went wrong. Please try again.'
    });
  }
};

// Forgot reset password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: 'User with that email does not exist'
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name
      },
      config.jwtResetPass,
      { expiresIn: '10m' }
    );
    const emailData = {
      from: config.emailFrom,
      to: email,
      subject: `Password Reset link`,
      html: `
        <h1>Please use the following link to reset your password</h1>
        <p>${config.clientUrl}auth/reset-password?token=${token}</p>
        <hr />
        <p>This email may contain sensitive information.</p>
        <p>${config.clientUrl}</p> 
      `
    };
    try {
      await user.updateOne({ resetPasswordLink: token });
      try {
        await sgMail.send(emailData);
        return res.json({
          message: `Email has been sent to ${email}. 
        Follow the instructions to reset your password. Redirecting...`
        });
      } catch (e) {
        return res.status(400).json({
          error: e.message
        });
      }
    } catch (e) {
      return res.status(400).json({
        error: 'DB connection error on user password forgot request'
      });
    }
  } catch (e) {
    return res.status(400).json({
      error: 'Email invalid'
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, config.jwtResetPass, async (error) => {
      if (error || resetPasswordLink === '') {
        return res.status(400).json({
          error: 'Expired link. Please, generate new link to reset password.'
        });
      }
      try {
        let user = await User.findOne({ resetPasswordLink });
        if (!user) {
          return res.status(400).json({
            error: 'No user found'
          });
        }
        user.password = newPassword;
        user.resetPasswordLink = '';
        try {
          await user.save();
          return res.json({
            message:
              'Great! Now you can signin with your new password. Redirecting...'
          });
        } catch (e) {
          return res.status(400).json({
            error: 'Error resetting user password'
          });
        }
      } catch (e) {
        return res.status(400).json({
          error: 'Something went wrong. Try later.'
        });
      }
    });
  } else {
    return res.status(400).json({
      error: 'Reset password link error'
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
        httpOnly: true,
        //secure: config.env !== 'development'
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

exports.signInProvider = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      error: 'Name and email are required'
    });
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
      res.cookie('token', token, {
        httpOnly: true,
        //secure: config.env !== 'development'
      });
      return res.status(200).json({
        token,
        user: {
          id: user.id,
          name,
          email
        }
      });
    } else {
      user = new User({
        name,
        email,
        password: email + config.jwtSecret
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
        res.cookie('token', token, {
          httpOnly: true,
          //secure: config.env !== 'development'
        });
        return res.status(200).json({
          token,
          user: {
            id: user.id,
            name,
            email
          }
        });
      } catch (e) {
        return res.status(400).json({ error: e.message });
      }
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

exports.getAuthenticatedUser = (req, res) => {
  if (req.cookies.token) {
    const { sub, name, email } = jwt.decode(req.cookies.token);
    return res.status(200).json({ id: sub, email, name });
  } else {
    return res.status(200).json({});
  }
};

exports.signOutUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'User not signed in'
    });
  }
  res.clearCookie('token');
  return res.status(200).json({
    message: 'Signed out successfully'
  });
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
        httpOnly: true,
        //secure: config.env !== 'development'
      });
      return res.redirect(`${config.clientUrl}auth/oauth`);
    });
  };
};
