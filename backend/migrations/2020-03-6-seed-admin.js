const mongoose = require('mongoose');
const Roles = require('../api/constants/roles');
const User = mongoose.model('User');

function up() {
  return new Promise((resolve, reject) => {
    User.register(
      {
        email: 'admin@admin.com',
        firstName: 'Super',
        lastName: 'Admin',
        role: Roles.ADMIN
      },
      'test',
      err => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

function down() {
  return User.deleteMany({
    email: 'admin@admin.com'
  });
}

module.exports = {
  up,
  down
};
