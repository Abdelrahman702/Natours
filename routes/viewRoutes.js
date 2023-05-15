const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).render('base');
});

router.get('/overview', viewsController.getOverview);

router.get('/tour', viewsController.getTour);

module.exports = router;