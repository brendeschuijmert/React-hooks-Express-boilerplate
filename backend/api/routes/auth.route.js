const express = require('express');
const { authController } = require('../controllers');
const router = express.Router();

router.route('/login').post(authController.login);
router.route('/signup').post(authController.register);

module.exports = { authRouter: router };
