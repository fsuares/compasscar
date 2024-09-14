const express = require('express');
const router = express.Router();
const swaggerSpec = require('../docs/swagger');
const swaggerUi = require('swagger-ui-express');
const carsController = require('../controllers/carsController')
const carValidations = require('../middlewares/carsMiddlewares');
const existsById = require('../middlewares/existsByIdParam');
const patch = require('../middlewares/updateCar');

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route to add a car
router.post('/api/v1/cars',
    carValidations.validateBrandField,
    carValidations.validateModelField,
    carValidations.validateYearField,
    carValidations.validateItemsField,
    carValidations.validateIfExists,
    carsController.addCar
);

// Route to update a car
router.patch('/api/v1/cars/:id',
    existsById.validateIfExists,
    patch.emptyBrand,
    patch.emptyModel,
    patch.emptyYear,
    patch.validateIfExists,
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