const express = require('express');
const router = express.Router();
const carsController = require('../controllers/carsController')
const addCarMid = require('../middlewares/addCar');
const existsById = require('../middlewares/existsByIdParam');

router.get('/api/v1/cars', carsController.getCars);
router.get('/api/v1/cars/:id', existsById.validateIfExists, carsController.getCarsByID);
router.post('/api/v1/cars',
    addCarMid.validateBrandField,
    addCarMid.validateModelField,
    addCarMid.validateYearField,
    addCarMid.validateItemsField,
    addCarMid.validateIfExists,
    carsController.addCar);
router.delete('/api/v1/cars/:id', existsById.validateIfExists, carsController.deleteCar);
router.patch('/api/v1/cars/:id', existsById.validateIfExists, carsController.updateCar);

module.exports = router;