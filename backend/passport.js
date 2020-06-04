const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const mongoose = require('mongoose');
const config = require('../config');

const User = mongoose.model('User');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const initializePassport = app => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      User.authenticate()
    )
  );

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtSecret
      },
      (jwtPayload, cb) => {
        return User.findById(jwtPayload._id)
          .then(user => cb(null, user))
          .catch(err => cb(err));
      }
    )
  );

  app.use(passport.initialize());
};

module.exports = initializePassport;
