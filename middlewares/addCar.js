// Description: Middlewares for addCar route
const connection = require('../database/connection');

// Middleware to validate if brand field exists
const validateBrandField = (req, res, next) => {
    const { body } = req;
    if (!body.brand) {
        return res.status(400).json({ message: 'brand is required' });
    } else next();
};

// Middleware to validate if model field exists
const validateModelField = (req, res, next) => {
    const { body } = req;
    if (!body.model) {
        return res.status(400).json({ message: 'model is required' });
    } else next();
};

// Middleware to validate if year field exists
const validateYearField = (req, res, next) => {
    const currentYear = new Date().getFullYear() + 1;
    const { body } = req;
    if (!body.year) {
        return res.status(400).json({ message: 'year is required' });
    };
    if (body.year < (currentYear - 10)) {
        res.status(400).json({ message: 'year should be between 2015 and 2025' });
    } else next();
};

// Middleware to validate if items field exists
const validateItemsField = (req, res, next) => {
    const { body } = req;
    if (!body.items) {
        return res.status(400).json({ message: 'items is required' });
    } else next();
};

// Middleware to validate if a car exists by brand, model and year.
const validateIfExists = async (req, res, next) => {
    const { body } = req;
    const querry = `SELECT EXISTS (SELECT 1 FROM cars WHERE brand = ? AND model = ? AND year = ?) AS carExists;`
    const carExists = await connection.execute(querry, [body.brand, body.model, body.year]);
    if (carExists[0][0].carExists == 1) {
        return res.status(409).json({ message: 'there is already a car with this data' });
    } else next();
};

module.exports = {
    validateBrandField,
    validateModelField,
    validateYearField,
    validateItemsField,
    validateIfExists
};