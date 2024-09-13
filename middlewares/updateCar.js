const connection = require('../database/connection');

const emptyBrand = (req, res, next) => {
	const { body } = req;
	if (!body.brand) next();
	if (body.brand.trim() === '') {
		return res.status(400).json({ message: 'brand must to be not empty' });
	} else next();

};

const emptyModel = (req, res, next) => {
	const { body } = req;
	if (!body.model) next();
	if (body.model.trim() === '') {
		return res.status(400).json({ message: 'model must to be not empty' });
	} else next();

};

const emptyYear = (req, res, next) => {
	const { body } = req;
	if (!body.year) next();
	if (body.year.toString().trim() === '') {
		return res.status(400).json({ message: 'year must to be not empty' });
	} else next();
};

const validateIfExists = async (req, res, next) => {
	const { id } = req.params;
	const { body } = req;
	const all_cars = await connection.execute(`SELECT * FROM cars`);
	const updated_car = await connection.execute(`SELECT * FROM cars WHERE id = ?`, [id]);
	const car = updated_car[0][0];

	if (body.brand) car.brand = body.brand;
	if (body.model) car.model = body.model;
	if (body.year) car.year = body.year.toString();

	const exists = all_cars[0].some(cars => cars.brand === car.brand && cars.model === car.model && cars.year === car.year);
	if (exists) {
		return res.status(409).json({ message: 'there is already a car with this data' });
	} else next();
};

module.exports = {
	emptyBrand,
	emptyModel,
	emptyYear,
	validateIfExists
};