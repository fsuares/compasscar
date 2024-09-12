// This file contains the middleware function to validate the year of the car.
const validateYear = (req, res, next) => {
	const currentYear = new Date().getFullYear() + 1;
	const limitYear = currentYear - 10;
	const { body } = req;
	if (body.year < (currentYear - 10)) {
		res.status(400).json({ message: `year should be between ${limitYear} and ${currentYear}` });
	} else next();
};

module.exports = {
	validateYear
};