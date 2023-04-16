const express = require('express');
const tourController = require('./../controllers/tourContoroller');
const router = express.Router();

//param middleware for getting the value of id parameter
//it runs only for tours
router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router; // this is to allow to export the content of this file
