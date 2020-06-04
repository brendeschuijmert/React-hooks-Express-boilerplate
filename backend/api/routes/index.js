const { authRouter } = require('./auth.route');
const { restaurantRouter } = require('./restaurant.route');
const { userRouter } = require('./user.route');

module.exports = {
  authRouter,
  restaurantRouter,
  userRouter
};
