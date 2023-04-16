const express = require('express');

const router = express.Router();

const userController = require('./../controllers/userContoroller');

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
