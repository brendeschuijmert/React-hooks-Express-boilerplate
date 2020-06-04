const User = require('../models/user.model');
const ROLES = require('../constants/roles');
const { restaurantService } = require('../services/restaurant.service');
const APIError = require('../utils/api-error');

class UserController {
  async create(req, res, next) {
    try {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      });

      if (req.user.role === ROLES.ADMIN && req.body.role) {
        user.role = req.body.role;
      }

      if (await User.findOne({ email: req.body.email })) {
        throw new APIError('The user with this email already exists!', 400);
      }

      User.register(user, req.body.password, err => {
        if (err) {
          err.status = 400;
          return next(err);
        }
        res
          .status(201)
          .send({ success: true })
          .end();
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { firstName, lastName, email, password = null } = req.body;
      Object.assign(req.userModel, {
        firstName,
        lastName,
        email
      });

      if (!!password) {
        await req.userModel.setPassword(password);
      }

      if (req.user.role === ROLES.ADMIN && req.body.role) {
        req.userModel.role = req.body.role;
      } else {
        throw new APIError(
          'You are not authorized to change the user role',
          403
        );
      }

      const updatedUser = await req.userModel.save();
      if (updatedUser.role !== ROLES.OWNER) {
        await restaurantService.removeRestaurantsByUser(updatedUser);
      }
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  read(req, res) {
    res.json(req.userModel);
  }

  async list(req, res, next) {
    try {
      const { skip, limit, filters } = req.query;
      let where = {};
      if (req.user.role === ROLES.OWNER) {
        where = { role: { $ne: ROLES.ADMIN } };
      }

      if (req.user.role === ROLES.ADMIN && filters) {
        Object.assign(where, filters);
      }

      const [list, totalCount] = await Promise.all([
        User.find(where)
          .skip(skip * 1 || 0)
          .limit(limit * 1 || undefined)
          .lean(),
        User.count(where)
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
    try {
      await req.userModel.remove();
      if (req.userModel.role === ROLES.OWNER) {
        await restaurantService.removeRestaurantsByUser(req.userModel);
      }
      res
        .status(200)
        .json(req.userModel)
        .end();
    } catch (err) {
      next(err);
    }
  }

  getUserByID(req, res, next, id) {
    User.findById(id)
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'The user was not found' });
          return;
        }

        req.userModel = user;
        next();
      })
      .catch(next);
  }
}

module.exports = { userController: new UserController() };
