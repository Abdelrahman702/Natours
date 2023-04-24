const express = require('express');

const userController = require('./../controllers/userContoroller');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router; // this is to allow to export the content of this file
