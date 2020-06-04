const express = require('express');
const { reviewController, restaurantController } = require('../controllers');
const ROLES = require('../constants/roles');
const { checkPermission } = require('../middlewares/permission');

const router = express.Router();
router.use(checkPermission([ROLES.ADMIN, ROLES.OWNER, ROLES.USER]));

router
  .route('/')
  .get(restaurantController.list)
  .post(restaurantController.create);

router
  .route('/:restaurantId')
  .get(restaurantController.read)
  .put(restaurantController.update)
  .delete(restaurantController.remove);

router
  .route('/:restaurantId/reviews')
  .get(reviewController.list)
  .post(reviewController.create);

router
  .route('/:restaurantId/reviews/:reviewId')
  .get(reviewController.read)
  .put(reviewController.update)
  .delete(reviewController.remove);

router.param('restaurantId', restaurantController.getRestaurantByID);
router.param('reviewId', reviewController.getReviewByID);

module.exports = { restaurantRouter: router };
