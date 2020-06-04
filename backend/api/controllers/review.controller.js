const Review = require('../models/review.model');
const Restaurant = require('../models/restaurant.model');
const ROLES = require('../constants/roles');
const { restaurantService } = require('../services/restaurant.service');

class ReviewController {
  async create(req, res, next) {
    try {
      const {
        restaurant: { _id }
      } = req;
      const review = new Review(req.body);
      review.restaurant = _id;
      const restaurant = await Restaurant.findById(_id);
      const newReview = await review.save();

      await restaurantService.updateFeedback(restaurant);
      res
        .status(201)
        .json(newReview)
        .end();
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    Object.assign(req.review, req.body);
    if (req.user.role !== ROLES.USER) {
      try {
        const updatedReview = await req.review.save();
        const restaurant = await Restaurant.findById(updatedReview.restaurant);

        await restaurantService.updateFeedback(restaurant);
        res.json(updatedReview).end();
      } catch (error) {
        next(error);
      }
    } else {
      res
        .status(403)
        .json({ message: 'You are not allowed to update the review' })
        .end();
    }
  }

  read(req, res) {
    res.json(req.review).end();
  }

  async list(req, res, next) {
    try {
      const { skip, limit } = req.query;
      let where = {};
      const { restaurantId } = req.params;
      where = { restaurant: restaurantId };

      const restaurant = await Restaurant.findById(restaurantId);
      const maxReview = await Review.findOne()
        .where(where)
        .sort({ rate: -1 })
        .populate('restaurant');

      const minReview = await Review.findOne()
        .where(where)
        .sort({ rate: 1 })
        .populate('restaurant');

      const [list, totalCount] = await Promise.all([
        Review.find(where)
          .sort({ date: -1 })
          .skip(skip * 1 || 0)
          .limit(limit * 1 || 5)
          .populate('restaurant'),
        Review.count(where)
      ]);

      res
        .json({
          avgRating: restaurant.avgRating,
          maxReview,
          minReview,
          list,
          totalCount
        })
        .end();
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    if (req.user.role !== ROLES.ADMIN) {
      res
        .status(403)
        .json({ message: 'You are not allowed to delete the review' })
        .end();
    } else {
      try {
        await req.review.remove();

        const restaurant = await Restaurant.findById(req.review.restaurant);
        await restaurantService.updateFeedback(restaurant);
        res.json(req.review).end();
      } catch (error) {
        next(error);
      }
    }
  }

  async getReviewByID(req, res, next, id) {
    try {
      const review = await Review.findById(id);
      if (!review) {
        res
          .status(404)
          .json({ message: 'The review was not found!' })
          .end();
      }
      req.review = review;
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  reviewController: new ReviewController()
};
