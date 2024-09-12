// Entry point of the application
const dotenv = require('dotenv').config()
const express = require('express');
const router = require('../routes/router');
const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(router);

app.listen(port, () => console.log(`server listening on port ${port}`));

