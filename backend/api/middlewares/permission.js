const passport = require('passport');

const isLoggedIn = passport.authenticate('jwt', { session: false });

const checkPermission = roles => {
  return (req, res, next) => {
    if (roles.indexOf(req.user.role) > -1) {
      next();
      return;
    }

    res.status(401).json({ message: 'You are not authorized' });
  };
};

module.exports = {
  checkPermission,
  isLoggedIn
};
