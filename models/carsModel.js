const connection = require('../database/connection');

const getCars = async (params) => {
    let { page, limit, brand, model, year } = params;
    if (!page) page = 1;
    if (!limit || limit < 1) limit = 5;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const querry = `SELECT * FROM cars`

    if (brand || model || year) {
        querry += ` WHERE `
        if (brand) {
            querry += `brand = '${brand}'`
        }
        if (model) {
            querry += `model = '${model}'`
        }
        if (year) {
            querry += `year = '${year}'`
        };
    };

    const [cars] = await connection.execute(querry);
    const pages = Math.ceil(cars.length / limit);
    const cars_limited = cars.slice(startIndex, endIndex);
    return { "count": cars.length, "pages": pages, "data": cars_limited };
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
    const params = [];
    if (brand) params.push(brand);
    if (model) params.push(model);
    if (year) params.push(year);
    params.push(id);

    if (brand || model || year) {
        let querry_car = `UPDATE cars
                            SET
                            ${brand ? 'brand = ?, ' : ''}
                            ${model ? 'model = ?, ' : ''}
                            ${year ? 'year = ?, ' : ''}`;

        querry_car = querry_car.trim().slice(0, -1);
        querry_car += ` WHERE id = ?;`

        const updatedCar = await connection.execute(querry_car, params);
    };

    if (items) {
        const dedup_items = [...new Set(items)];
        const querry_delete_items = `DELETE FROM cars_items WHERE car_id = ?;`
        const querry_items = `INSERT INTO cars_items (name, car_id)
                        VALUES ( ? , ? );`;
        const removeItems = await connection.execute(querry_delete_items, [id]);
        dedup_items.forEach(item => {
            const createdItems = connection.execute(querry_items, [item, id]);
        });
    };

    return car;
};

module.exports = {
    getCars,
    getCarsByID,
    addCar,
    deleteCar,
    updateCar
};