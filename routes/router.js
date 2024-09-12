const express = require('express');
const router = express.Router();
const carsController = require('../controllers/carsController')

router.get('/api/v1/cars', carsController.getCars);
router.get('/api/v1/cars/:id', carsController.getCarsByID);
router.post('/api/v1/cars', carsController.addCar);
router.delete('/api/v1/cars/:id', carsController.deleteCar);
router.patch('/api/v1/cars/:id', carsController.updateCar);

module.exports = router;