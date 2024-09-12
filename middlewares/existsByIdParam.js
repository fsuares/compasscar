
const connection = require('../database/connection');

const validateIfExists = async (req, res, next) => {
    const { id } = req.params;
    const querry = `SELECT EXISTS (SELECT 1 FROM cars WHERE id = ?) AS carExists;`
    const carExists = await connection.execute(querry, [id]);
    if (carExists[0][0].carExists == 0) {
        return res.status(404).json({ message: 'car not found' });
    } else next();
};

module.exports = {
    validateIfExists
};