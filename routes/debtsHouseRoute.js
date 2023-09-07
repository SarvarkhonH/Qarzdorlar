const express = require("express");
// const app = express()
const Router = express.Router();
const debtsHouseController = require("../controllers/debtsHousecontroller");
const authController = require("../controllers/authcontroller");

Router.route("/")
  .get(authController.protect, debtsHouseController.getalldebts)
  .post(authController.protect, debtsHouseController.createdebts)
  

Router.route("/search").get(
  authController.protect,
  debtsHouseController.searchingSystem
);



Router.route("/:id")
  .get(authController.protect, debtsHouseController.UserDebts)
  .patch(authController.protect, debtsHouseController.updateDebts);
Router.route("/signup").post(authController.signup);
Router.route("/login").post(authController.login);
Router.route("/verify-otp").post(authController.verifyOTP);



module.exports = Router;
  