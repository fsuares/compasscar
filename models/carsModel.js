const connection = require('../database/connection');

const getCars = async () => {
    const querry = `SELECT
                        cars.id,
                        cars.brand,
                        cars.model,
                        cars.year,
                        JSON_ARRAYAGG(cars_items.name) AS items
                    FROM
                        cars
                    LEFT JOIN
                        cars_items ON cars.id = cars_items.car_id
                    GROUP BY
                        cars.id, cars.brand, cars.model, cars.year
                    ORDER BY
                        cars.id;`
    const [cars] = await connection.execute(querry);
    return cars;
};

const getCarsByID = async (id) => {
    const querry = `SELECT
                        cars.id,
                        cars.brand,
                        cars.model,
                        cars.year,
                        JSON_ARRAYAGG(cars_items.name) AS items
                    FROM
                        cars
                    LEFT JOIN
                        cars_items ON cars.id = cars_items.car_id
                    WHERE cars.id = ?
                    GROUP BY
                        cars.id, cars.brand, cars.model, cars.year
                    ORDER BY
                        cars.id;`
    const [car] = await connection.execute(querry, [id]);
    return car;
};

module.exports = {
    getCars,
    getCarsByID
};