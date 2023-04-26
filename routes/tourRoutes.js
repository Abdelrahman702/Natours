const express = require('express');
const tourController = require('./../controllers/tourContoroller');
const router = express.Router();
const authController = require('./../controllers/authController');

//param middleware for getting the value of id parameter
//it runs only for tours
// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap')
  .get(tourController.alisasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo,
    tourController.deleteTour
  );

module.exports = router; // this is to allow to export the content of this file
