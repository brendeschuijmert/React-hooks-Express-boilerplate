const { authController } = require('./auth.controller');
const { restaurantController } = require('./restaurant.controller');
const { reviewController } = require('./review.controller');
const { userController } = require('./user.controller');

module.exports = {
  authController,
  restaurantController,
  reviewController,
  userController
};
