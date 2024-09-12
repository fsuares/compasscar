const carsModel = require('../models/carsModel');

const getCars = async (req, res) => {
    try {
        const cars = await carsModel.getCars(req.query);
        return res.status(200).json(cars);
    } catch (error) {
        return res.status(500).json(`500: internal server error`);
    };
};

const getCarsByID = async (req, res) => {
    try {
        const cars = await carsModel.getCarsByID(req.params);
        return res.status(200).json(cars);
    } catch (error) {
        return res.status(500).json(`500: internal server error`);
    };
};

const addCar = async (req, res) => {
    try {
        const car = await carsModel.addCar(req.body);
        return res.status(201).json({ id: car });
    } catch (error) {
        return res.status(500).json(`500: internal server error`)
    };
};

const deleteCar = async (req, res) => {
    try {
        const car = await carsModel.deleteCar(req.params.id);
        return res.status(204).json(`204: no content`);
    } catch (error) {
        return res.status(500).json(`500: internal server error`);
    };
};

const updateCar = async (req, res) => {
    try {
        const car = await carsModel.updateCar(req.params.id, req.body);
        return res.status(200).json(car);
    } catch (error) {
        return res.status(500).json(`500: internal server error`);
    };
};

module.exports = {
    getCars,
    getCarsByID,
    addCar,
    deleteCar,
    updateCar
};