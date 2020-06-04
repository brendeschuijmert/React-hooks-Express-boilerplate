const express = require('express');
const { userController } = require('../controllers');
const ROLES = require('../constants/roles');
const { checkPermission } = require('../middlewares/permission');

const router = express.Router();

router.use(checkPermission([ROLES.ADMIN]));

router
  .route('/')
  .get(userController.list)
  .post(userController.create);

router
  .route('/:userId')
  .get(userController.read)
  .put(userController.update)
  .delete(userController.remove);

router.param('userId', userController.getUserByID);

module.exports = { userRouter: router };
