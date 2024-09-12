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

const getCarsByID = async (params) => {
    const { id } = params;
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

const addCar = async (car) => {
    const { brand, model, year } = car;
    const items = [...new Set(car.items)];
    const querry_car = `INSERT INTO cars (brand, model, year)
                    VALUES ( ? , ? , ? );`
    const querry_items = `INSERT INTO cars_items (name, car_id)
                    VALUES ( ? , ? );`
    const createdCar = await connection.execute(querry_car, [brand, model, year]);
    items.forEach(item => {
        const createdItems = connection.execute(querry_items, [item, createdCar[0].insertId]);
    });

    return createdCar[0].insertId;
};

const deleteCar = async (id) => {
    const qrr_deleteCarItems = `DELETE FROM cars_items WHERE car_id = ?;`
    const qrr_deleteCar = `DELETE FROM cars WHERE id = ?;`
    const deleteCarItems = await connection.execute(qrr_deleteCarItems, [id]);
    const deleteCar = await connection.execute(qrr_deleteCar, [id]);
};

const updateCar = async (id, car) => {
    const { brand, model, year, items } = car;
    const querry_car = `UPDATE cars
                        SET brand = ?,
                            model = ?,
                            year = ?
                        WHERE id = ?;`
    const querry_delete_items = `DELETE FROM cars_items WHERE car_id = ?;`
    const querry_items = `INSERT INTO cars_items (name, car_id)
                    VALUES ( ? , ? );`
    const updatedCar = await connection.execute(querry_car, [brand, model, year, id]);
    const removeItems = await connection.execute(querry_delete_items, [id]);
    items.forEach(item => {
        const createdItems = connection.execute(querry_items, [item, id]);
    });

    return car;
};

module.exports = {
    getCars,
    getCarsByID,
    addCar,
    deleteCar,
    updateCar
};