const ROLES = require('../constants/roles');

function isAdmin(user) {
  return user && user.role === ROLES.ADMIN;
}

function isOwner(user) {
  return user && user.role === ROLES.OWNER;
}

function isUser(user) {
  return user && user.role === ROLES.USER;
}

function checkRoles(roles) {
  return (req, res, next) => {
    if (roles.indexOf(req.user.role) > -1) {
      next();
      return;
    }

    res.status(401).json({ message: 'You are not authorized' });
  };
}

module.exports = {
  isAdmin,
  isOwner,
  isUser,
  checkRoles
};
