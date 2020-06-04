const passport = require('passport');
const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const APIError = require('../utils/api-error');

const User = mongoose.model('User');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const exitingUser = await User.findOne({ email }).lean();

      if (exitingUser) {
        throw new APIError('The user with this email already exits!', 400);
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName
      });

      User.register(user, password, err => {
        if (err) {
          err.status = 400;
          return next(err);
        }

        res
          .status(201)
          .send({ success: true })
          .end();
      });
    } catch (error) {
      next(error);
    }
  }

  login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new APIError('Email or password can not be empty', 401));
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        console.error(info);
        return next(err || new APIError('Email or password is wrong', 401));
      }

      req.login(user, { session: false }, err1 => {
        if (err1) {
          return next(err1);
        }

        const token = jwt.sign(user.toSafeJSON(), config.jwtSecret, {
          expiresIn: config.jwtExpiresIn
        });

        return res.json({
          user: user.toSafeJSON(),
          token
        });
      });
    })(req, res);
  }
}

module.exports = {
  authController: new AuthController()
};
