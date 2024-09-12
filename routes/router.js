const express = require('express');
const router = express.Router();
const carsController = require('../controllers/carsController')
const addCarMid = require('../middlewares/addCar');
const existsById = require('../middlewares/existsByIdParam');
const updateCar = require('../middlewares/updateCar');

// Route to add a car
router.post('/api/v1/cars',
    addCarMid.validateBrandField,
    addCarMid.validateModelField,
    addCarMid.validateYearField,
    addCarMid.validateItemsField,
    addCarMid.validateIfExists,
    carsController.addCar
);

// Route to update a car
router.patch('/api/v1/cars/:id',
    existsById.validateIfExists,
    updateCar.validateYear,
    carsController.updateCar
);

// Route to get all cars
router.get('/api/v1/cars',
    carsController.getCars
);

// Route to get a car by id
router.get('/api/v1/cars/:id',
    existsById.validateIfExists,
    carsController.getCarsByID
);

// Route to delete a car by id
router.delete('/api/v1/cars/:id',
    existsById.validateIfExists,
    carsController.deleteCar
);

module.exports = router;