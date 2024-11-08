const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();
const port = process.env.PORT;;

const options = {
	definition: {
		"openapi": "3.0.0",
		"info": {
			"title": "Compass Car",
			"description": "The `Compasscar` is a project designed to manage vehicle registrations in a MySQL database, providing a complete RESTful API to insert, update, remove, and search for vehicles. Compasscar also offers data validation to mitigate errors.",
			"contact": {
				"name": "Fernando Suares",
				"email": "contato.fsuares@gmail.com"
			},
			"version": "1.0.0"
		},
		"servers": [
			{
				"url": `http://localhost:${port}`,
				"description": "Localhost to test api",
				"variables": {
					"DB_HOST": {
						"description": "Hostname of your database",
						"default": "Hostname database"
					},
					"DB_USER": {
						"description": "User to log in database",
						"default": "User database"
					},
					"DB_PASS": {
						"description": "Password of user ",
						"default": "Password database"
					},
					"DB_NAME": {
						"description": "Name of your database",
						"default": "Database name"
					},
					"PORT": {
						"description": "Port of your express server",
						"default": "Server port"
					}
				}
			}
		],
		"paths": {
			"/api/v1/cars": {
				"get": {
					"tags": [
						"Cars"
					],
					"summary": "List all cars",
					"description": "Returns all registered cars in database",
					"operationId": "getCars",
					"parameters": [
						{
							"name": "page",
							"in": "query",
							"description": "number of a page you want to see",
							"required": false,
							"style": "form",
							"explode": true,
							"schema": {
								"type": "integer",
								"format": "int32"
							}
						},
						{
							"name": "limit",
							"in": "query",
							"description": "max number of records to return",
							"required": false,
							"style": "form",
							"explode": true,
							"schema": {
								"type": "integer",
								"format": "int32"
							}
						},
						{
							"name": "brand",
							"in": "query",
							"description": "search for a brand of car",
							"required": false,
							"style": "form",
							"explode": true,
							"schema": {
								"type": "string"
							}
						},
						{
							"name": "model",
							"in": "query",
							"description": "search for a model of car",
							"required": false,
							"style": "form",
							"explode": true,
							"schema": {
								"type": "string"
							}
						},
						{
							"name": "year",
							"in": "query",
							"description": "search for a year of car",
							"required": false,
							"style": "form",
							"explode": true,
							"schema": {
								"type": "integer"
							}
						}
					],
					"responses": {
						"200": {
							"description": "Return all cars or specified cars match with params ",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/responseGetCars"
									},
									"examples": {
										"list all cars": {
											"value": {
												"count": 2,
												"pages": 1,
												"data": [
													{
														"id": "1",
														"brand": "Porsche",
														"model": "Panamera",
														"year": "2021"
													},
													{
														"id": "2",
														"brand": "Lamborghini",
														"model": "Huracan",
														"year": "2019"
													}
												]
											}
										},
										"found all car matches by parameters": {
											"value": {
												"count": 15,
												"pages": 3,
												"data": [
													{
														"id": "6",
														"brand": "Porsche",
														"model": "Taycan",
														"year": "2024"
													},
													{
														"id": "10",
														"brand": "Porsche",
														"model": "911",
														"year": "2023"
													}
												]
											}
										}
									}
								}
							}
						},
						"500": {
							"description": "Return when are internal server error",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_500"
									},
									"examples": {
										"Example 1": {
											"value": {
												"message": "500 - internal server error"
											}
										}
									}
								}
							}
						}
					}
				},
				"post": {
					"tags": [
						"Cars"
					],
					"summary": "Create new car",
					"description": "Create a new car in the database",
					"operationId": "addCar",
					"requestBody": {
						"$ref": "#/components/requestBodies/createCar"
					},
					"responses": {
						"201": {
							"description": "Returns when car are sucess created in database",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_201"
									},
									"examples": {
										"car was created": {
											"value": {
												"id": 123
											}
										}
									}
								}
							}
						},
						"409": {
							"description": "Return when car already exists in database",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_500"
									},
									"examples": {
										"Example 1": {
											"value": {
												"message": "409 - there isready a car with this data"
											}
										}
									}
								}
							}
						},
						"500": {
							"description": "Return when are internal server error",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_500"
									},
									"examples": {
										"Example 1": {
											"value": {
												"message": "500 - internal server error"
											}
										}
									}
								}
							}
						}
					}
				}
			},
			"/api/v1/cars/{id}": {
				"get": {
					"tags": [
						"Cars ID"
					],
					"summary": "Get a car by id",
					"description": "Get specified car by id",
					"operationId": "getCarsByID",
					"parameters": [
						{
							"name": "id",
							"in": "path",
							"description": "id of a car",
							"required": true,
							"style": "simple",
							"explode": false,
							"schema": {
								"type": "number"
							}
						}
					],
					"responses": {
						"200": {
							"description": "Returns when car are found in database",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/responseGetCarByID"
									},
									"examples": {
										"find a car by id": {
											"value": {
												"id": 2,
												"brand": "Lamborghini",
												"model": "Aventador",
												"year": 2019,
												"items": [
													"Ar-condicionado",
													"Blindagem",
													"Bancos de couro"
												]
											}
										}
									}
								}
							}
						},
						"404": {
							"description": "Return when car not found in database",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_500"
									},
									"examples": {
										"Example 1": {
											"value": {
												"message": "404 - car not found"
											}
										}
									}
								}
							}
						},
						"500": {
							"description": "Return when are internal server error",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_500"
									},
									"examples": {
										"Example 1": {
											"value": {
												"message": "500 - internal server error"
											}
										}
									}
								}
							}
						}
					}
				},
				"delete": {
					"tags": [
						"Cars ID"
					],
					"summary": "Delete a car in database by id",
					"description": "Delete existing car registered in database",
					"operationId": "deleteCars",
					"parameters": [
						{
							"name": "id",
							"in": "path",
							"description": "id of a car",
							"required": true,
							"style": "simple",
							"explode": false,
							"schema": {
								"type": "number"
							}
						},
						{
							"name": "id",
							"in": "query",
							"description": "id of a cara you want to delete",
							"required": false,
							"style": "form",
							"explode": true,
							"schema": {
								"type": "integer"
							}
						}
					],
					"responses": {
						"204": {
							"description": "Returns when are no content to be showed and operation is sucess",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_204"
									}
								}
							}
						},
						"404": {
							"description": "Return when car not found in database",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_500"
									},
									"examples": {
										"Example 1": {
											"value": {
												"message": "404 - car not found"
											}
										}
									}
								}
							}
						},
						"500": {
							"description": "Return when are internal server error",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_500"
									},
									"examples": {
										"Example 1": {
											"value": {
												"message": "500 - internal server error"
											}
										}
									}
								}
							}
						}
					}
				},
				"patch": {
					"tags": [
						"Cars ID"
					],
					"summary": "Update existing car in database",
					"description": "Update existing car registered in database",
					"operationId": "updateCar",
					"parameters": [
						{
							"name": "id",
							"in": "path",
							"description": "id of a car",
							"required": true,
							"style": "simple",
							"explode": false,
							"schema": {
								"type": "number"
							}
						}
					],
					"requestBody": {
						"$ref": "#/components/requestBodies/updateCar"
					},
					"responses": {
						"204": {
							"description": "Returns when are no content to be showed and operation is sucess",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_204"
									}
								}
							}
						},
						"400": {
							"description": "Returns when are bad request. Some field are empty",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_500"
									},
									"examples": {
										"brand is empty": {
											"value": {
												"message": "400 - field brand must to be not empty"
											}
										},
										"model is empty": {
											"value": {
												"message": "400 - field model must to be not empty"
											}
										},
										"year is empty": {
											"value": {
												"message": "400 - field year must to be not empty"
											}
										}
									}
								}
							}
						},
						"409": {
							"description": "Return when car already exists in database",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_500"
									},
									"examples": {
										"Example 1": {
											"value": {
												"message": "409 - there isready a car with this data"
											}
										}
									}
								}
							}
						},
						"500": {
							"description": "Return when are internal server error",
							"content": {
								"application/json": {
									"schema": {
										"$ref": "#/components/schemas/inline_response_500"
									},
									"examples": {
										"Example 1": {
											"value": {
												"message": "500 - internal server error"
											}
										}
									}
								}
							}
						}
					},
					"x-internal": false
				}
			}
		},
		"components": {
			"schemas": {
				"responseGetCars": {
					"title": "responseGetCars",
					"type": "object",
					"properties": {
						"count": {
							"type": "integer"
						},
						"pages": {
							"type": "integer",
							"x-stoplight": {
								"id": "t3ilfk0dl7znm"
							}
						},
						"data": {
							"type": "array",
							"items": {
								"$ref": "#/components/schemas/responseGetCars_data"
							},
							"x-stoplight": {
								"id": "amrnc2qhhnpsf"
							}
						}
					},
					"x-examples": {
						"Example 1": {
							"count": 1,
							"pages": 1,
							"data": [
								{
									"id": "1",
									"brand": "Porsche",
									"model": "Panamera",
									"year": "2020"
								},
								{
									"id": 2,
									"brand": "Lamborghini",
									"model": "Aventador",
									"year": 2019
								}
							]
						}
					}
				},
				"responseGetCarByID": {
					"title": "responseGetCarByID",
					"type": "object",
					"properties": {
						"id": {
							"type": "integer"
						},
						"brand": {
							"type": "string",
							"x-stoplight": {
								"id": "pd216ugu17gsx"
							}
						},
						"model": {
							"type": "string",
							"x-stoplight": {
								"id": "o9j4qx7c1u94a"
							}
						},
						"year": {
							"type": "integer",
							"x-stoplight": {
								"id": "lhuy6du0yusk8"
							}
						},
						"items": {
							"type": "array",
							"items": {},
							"x-stoplight": {
								"id": "00epx4ury2id3"
							}
						}
					},
					"x-examples": {
						"Example 1": {
							"id": 2,
							"brand": "Lamborghini",
							"model": "Aventador",
							"year": 2019,
							"items": [
								"Ar-condicionado",
								"Blindagem",
								"Bancos de couro"
							]
						}
					}
				},
				"inline_response_500": {
					"type": "object",
					"properties": {
						"message": {
							"type": "string"
						}
					}
				},
				"inline_response_201": {
					"type": "object",
					"properties": {
						"id": {
							"type": "integer"
						}
					}
				},
				"inline_response_204": {
					"properties": {
						"id": {
							"type": "string"
						}
					}
				},
				"responseGetCars_data": {
					"type": "object",
					"properties": {
						"id": {
							"type": "integer",
							"x-stoplight": {
								"id": "xasw1t59s35s0"
							}
						},
						"brand": {
							"type": "string",
							"x-stoplight": {
								"id": "2wb95dx95lii8"
							}
						},
						"model": {
							"type": "string",
							"x-stoplight": {
								"id": "uw2gpatif4yd1"
							}
						},
						"year": {
							"maximum": 2025,
							"exclusiveMaximum": true,
							"minimum": 2015,
							"exclusiveMinimum": true,
							"type": "integer",
							"x-stoplight": {
								"id": "ov019hgp9nqzv"
							}
						}
					}
				}
			},
			"responses": {
				"201": {
					"description": "Returns when car are sucess created in database",
					"content": {
						"application/json": {
							"schema": {
								"$ref": "#/components/schemas/inline_response_201"
							},
							"examples": {
								"car was created": {
									"value": {
										"id": 123
									}
								}
							}
						}
					}
				},
				"204": {
					"description": "Returns when are no content to be showed and operation is sucess",
					"content": {
						"application/json": {
							"schema": {
								"$ref": "#/components/schemas/inline_response_204"
							}
						}
					}
				},
				"400": {
					"description": "Returns when are bad request. Some field are empty",
					"content": {
						"application/json": {
							"schema": {
								"$ref": "#/components/schemas/inline_response_500"
							},
							"examples": {
								"brand is empty": {
									"value": {
										"message": "400 - field brand must to be not empty"
									}
								},
								"model is empty": {
									"value": {
										"message": "400 - field model must to be not empty"
									}
								},
								"year is empty": {
									"value": {
										"message": "400 - field year must to be not empty"
									}
								}
							}
						}
					}
				},
				"404": {
					"description": "Return when car not found in database",
					"content": {
						"application/json": {
							"schema": {
								"$ref": "#/components/schemas/inline_response_500"
							},
							"examples": {
								"Example 1": {
									"value": {
										"message": "404 - car not found"
									}
								}
							}
						}
					}
				},
				"409": {
					"description": "Return when car already exists in database",
					"content": {
						"application/json": {
							"schema": {
								"$ref": "#/components/schemas/inline_response_500"
							},
							"examples": {
								"Example 1": {
									"value": {
										"message": "409 - there isready a car with this data"
									}
								}
							}
						}
					}
				},
				"500": {
					"description": "Return when are internal server error",
					"content": {
						"application/json": {
							"schema": {
								"$ref": "#/components/schemas/inline_response_500"
							},
							"examples": {
								"Example 1": {
									"value": {
										"message": "500 - internal server error"
									}
								}
							}
						}
					}
				},
				"200-GET": {
					"description": "Return all cars or specified cars match with params ",
					"content": {
						"application/json": {
							"schema": {
								"$ref": "#/components/schemas/responseGetCars"
							},
							"examples": {
								"list all cars": {
									"value": {
										"count": 2,
										"pages": 1,
										"data": [
											{
												"id": "1",
												"brand": "Porsche",
												"model": "Panamera",
												"year": "2021"
											},
											{
												"id": "2",
												"brand": "Lamborghini",
												"model": "Huracan",
												"year": "2019"
											}
										]
									}
								},
								"found all car matches by parameters": {
									"value": {
										"count": 15,
										"pages": 3,
										"data": [
											{
												"id": "6",
												"brand": "Porsche",
												"model": "Taycan",
												"year": "2024"
											},
											{
												"id": "10",
												"brand": "Porsche",
												"model": "911",
												"year": "2023"
											}
										]
									}
								}
							}
						}
					}
				},
				"200-GET-ID": {
					"description": "Returns when car are found in database",
					"content": {
						"application/json": {
							"schema": {
								"$ref": "#/components/schemas/responseGetCarByID"
							},
							"examples": {
								"find a car by id": {
									"value": {
										"id": 2,
										"brand": "Lamborghini",
										"model": "Aventador",
										"year": 2019,
										"items": [
											"Ar-condicionado",
											"Blindagem",
											"Bancos de couro"
										]
									}
								}
							}
						}
					}
				}
			},
			"parameters": {
				"id": {
					"name": "id",
					"in": "path",
					"description": "id of a car",
					"required": true,
					"style": "simple",
					"explode": false,
					"schema": {
						"type": "integer"
					}
				}
			},
			"requestBodies": {
				"createCar": {
					"description": "All the values are mandatory",
					"content": {
						"application/json": {
							"schema": {
								"type": "object",
								"properties": {
									"brand": {
										"type": "string",
										"x-stoplight": {
											"id": "mz16s4ls8v7sf"
										}
									},
									"model": {
										"type": "string",
										"x-stoplight": {
											"id": "g6z5mmj8cblwp"
										}
									},
									"year": {
										"maximum": 2025,
										"exclusiveMaximum": true,
										"minimum": 2015,
										"exclusiveMinimum": true,
										"type": "integer",
										"format": "int32",
										"x-stoplight": {
											"id": "6wax3942xq813"
										}
									},
									"items": {
										"type": "array",
										"items": {
											"type": "string",
											"x-stoplight": {
												"id": "h8dux9qi432ri"
											}
										},
										"x-stoplight": {
											"id": "6mqbi252tld2e"
										}
									}
								}
							}
						}
					}
				},
				"updateCar": {
					"description": "All the values are optional",
					"content": {
						"application/json": {
							"schema": {
								"type": "object",
								"properties": {
									"brand": {
										"type": "string",
										"x-stoplight": {
											"id": "zo0dem8ce0zn4"
										}
									},
									"model": {
										"type": "string",
										"x-stoplight": {
											"id": "km0q3l5edoa25"
										}
									},
									"year": {
										"maximum": 2025,
										"exclusiveMaximum": true,
										"minimum": 2015,
										"exclusiveMinimum": true,
										"type": "integer",
										"format": "int32",
										"x-stoplight": {
											"id": "bckv9ud90jeew"
										}
									},
									"items": {
										"type": "array",
										"items": {
											"type": "string",
											"x-stoplight": {
												"id": "kdg5to8gx4gbr"
											}
										},
										"x-stoplight": {
											"id": "zlhbb5hkpr2ne"
										}
									}
								}
							}
						}
					}
				}
			}
		},
		"x-internal": true
	},
	apis: ['../routes/router.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;