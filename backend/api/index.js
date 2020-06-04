const express = require('express');
const { isLoggedIn } = require('./middlewares/permission');
const { authRouter, userRouter, restaurantRouter } = require('./routes');
const router = express.Router();

router.use('/auth', authRouter);
router.use('/restaurants', isLoggedIn, restaurantRouter);
router.use('/users', isLoggedIn, userRouter);

module.exports = { apiRouter: router };
