// const mongoose = require('mongoose');
const _ = require('lodash');
const Restaurant = require('../models/restaurant.model');
const Review = require('../models/review.model');
const ROLES = require('../constants/roles');

class RestaurantController {
  async create(req, res, next) {
    try {
      const restaurant = new Restaurant(req.body);
      if (req.user.role === ROLES.USER) {
        res
          .status(403)
          .json({ message: 'You are not allowed to add restaurant' });
      } else {
        restaurant.user =
          req.user.role === ROLES.OWNER ? req.user._id : req.body.user;

        if (req.user.role === ROLES.ADMIN && !req.body.user) {
          res.status(400).json({ message: 'An onwer has to be provided!' });
        }

        const newRestaurant = await restaurant.save();
        res.status(201).json(newRestaurant);
      }
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    Object.assign(req.restaurant, req.body);
    if (req.user.role === ROLES.ADMIN) {
      try {
        const updatedRestaurant = await req.restaurant.save();
        res.json(updatedRestaurant);
      } catch (error) {
        next(error);
      }
    } else {
      res
        .status(403)
        .json({ message: 'You are not allowed to update restaurant' });
    }
  }

  read(req, res) {
    res.json(req.restaurant);
  }

  async list(req, res, next) {
    try {
      const { skip = 0, limit = 5, filters = { from: 0, to: 5 } } = req.query;

      if (
        !(
          0 <= filters.from < 5 &&
          0 < filters.to <= 5 &&
          filters.from < filters.to
        )
      ) {
        throw new APIError('Filters arguments are invalid', 400);
      }
      let where = {
        avgRating: { $gte: filters.from * 1, $lte: filters.to * 1 }
      };

      if (req.user.role === ROLES.OWNER) {
        Object.assign(where, { user: req.user._id });
      }

      const [list, totalCount] = await Promise.all([
        Restaurant.find(where)
          .populate('user')
          .sort({ avgRating: 'desc' })
          .skip(skip * 1 || 0)
          .limit(limit * 1 || 5)
          .lean(),
        Restaurant.count(where)
      ]);

      res.json({
        skip: skip * 1 || 0,
        limit: limit * 1 || 5,
        totalCount,
        list
      });
    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    if (req.user.role !== ROLES.ADMIN) {
      res
        .status(403)
        .json({ message: 'You are not allowed to delete restaurant!' });
    } else {
      try {
        await req.restaurant.remove();
        res.json(req.restaurant);
      } catch (error) {
        next(error);
      }
    }
  }

  getRestaurantByID(req, res, next, id) {
    Restaurant.findById(id)
      .then(restaurant => {
        if (!restaurant) {
          res.status(404).json({ message: 'The restaurant was not found' });
          return;
        }

        req.restaurant = restaurant;
        next();
      })
      .catch(next);
  }
}

module.exports = { restaurantController: new RestaurantController() };
