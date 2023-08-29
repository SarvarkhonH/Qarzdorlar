const express = require("express");
const Router = express.Router();
const debtsHouseController = require('../controllers/debtsHousecontroller')


Router.route("/")
.get(debtsHouseController.getalldebts)
.post(debtsHouseController.createdebts)

Router.route("/:number")
.patch(debtsHouseController.updatedebts)


module.exports = Router;
