const connection = require('../database/connection');

// Model to get cars
const getCars = async (params) => {
    let { page, limit, brand, model, year } = params;
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 5;
    if (limit > 10) limit = 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let query = `SELECT * FROM cars`;

    if (brand || model || year) {
        query += ` WHERE `
        if (brand) {
            query += `brand = '${brand}' AND `
        };
        if (model) {
            query += `model = '${model}' AND `
        };
        if (year) {
            query += `year = '${year}' AND `
        };
        query = query.trim().slice(0, -3);
    };

    const [cars] = await connection.execute(query);
    const pages = Math.ceil(cars.length / limit);
    const cars_limited = cars.slice(startIndex, endIndex);
    return { "count": cars.length, "pages": pages, "data": cars_limited };
};

// Model to get cars by ID
const getCarsByID = async (params) => {
    const { id } = params;
    const query = `SELECT
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
                        cars.id;`;
    const [car] = await connection.execute(query, [id]);
    return car;
};

// Model to add a car
const addCar = async (car) => {
    const { brand, model, year } = car;
    const items = [...new Set(car.items)];
    const query_car = `INSERT INTO cars (brand, model, year)
                    VALUES ( ? , ? , ? );`;
    const query_items = `INSERT INTO cars_items (name, car_id)
                    VALUES ( ? , ? );`;
    const createdCar = await connection.execute(query_car, [brand, model, year]);
    items.forEach(item => {
        item = item.trim();
        if (item != '') {
            const createdItems = connection.execute(query_items, [item, createdCar[0].insertId]);
        };
    });

    return createdCar[0].insertId;
};

// Model to delete a car
const deleteCar = async (id) => {
    const qrr_deleteCarItems = `DELETE FROM cars_items WHERE car_id = ?;`;
    const qrr_deleteCar = `DELETE FROM cars WHERE id = ?;`;
    const deleteCarItems = await connection.execute(qrr_deleteCarItems, [id]);
    const deleteCar = await connection.execute(qrr_deleteCar, [id]);
};

// Model to update a car
const updateCar = async (id, car) => {
    const { brand, model, year, items } = car;
    const params = [];
    if (brand) params.push(brand);
    if (model) params.push(model);
    if (year) params.push(year);
    params.push(id);

    if (brand || model || year) {
        let query_car = `UPDATE cars
                            SET
                            ${brand ? 'brand = ?, ' : ''}
                            ${model ? 'model = ?, ' : ''}
                            ${year ? 'year = ?, ' : ''}`;

        query_car = query_car.trim().slice(0, -1);
        query_car += ` WHERE id = ?;`;

        const updatedCar = await connection.execute(query_car, params);
    };

    if (items) {
        const dedup_items = [...new Set(items)];
        const query_delete_items = `DELETE FROM cars_items WHERE car_id = ?;`
        const query_items = `INSERT INTO cars_items (name, car_id)
                        VALUES ( ? , ? );`;
        const removeItems = await connection.execute(query_delete_items, [id]);
        dedup_items.forEach(item => {
            item.trim();
            if (item != '' && item != null) {
                const createdItems = connection.execute(query_items, [item, id]);
            };
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