const express = require('express');
const router = express.Router();
const carsController = require('../controllers/carsController')

router.get('/api/v1/cars', carsController.getCars);
router.get('/api/v1/cars/:id', carsController.getCarsByID);

module.exports = router;