const carsModel = require('../models/carsModel');

const getCars = async (_req, res) => {
    try {
        const cars = await carsModel.getCars();
        return res.status(200).json(cars);
    } catch (error) {
        console.error(error.name);
    };
};

const getCarsByID = async (req, res) => {
    try {
        const { id } = req.params;
        const cars = await carsModel.getCarsByID(id);
        return res.status(200).json(cars);
    } catch (error) {
        return res.status(404).json(`car not found`);
    };
};

module.exports = {
    getCars,
    getCarsByID
};