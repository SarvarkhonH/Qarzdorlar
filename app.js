const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json())

const debtsHouse = require(`./routes/debtsHouseRoute`);
app.use(`/api/v1/debtshouse`, debtsHouse);


module.exports = app;
