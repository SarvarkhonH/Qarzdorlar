const express = require('express');

const Router = express.Router();
const debtsHouseController = require('../controllers/debtsHousecontroller');
const authController = require('../controllers/authcontroller');

Router.route('/')
  .get(authController.protect, debtsHouseController.getalldebts)
  .post(authController.protect, debtsHouseController.createdebts);
// .delete(debtsHouseController.delete)
Router.route('/expired').get(
  authController.protect,
  debtsHouseController.getexpired,
);
Router.route('/search').get(
  authController.protect,
  debtsHouseController.searchingSystem,
);

Router.route('/payment').get(
  authController.protect,
  debtsHouseController.getpayment,
);
Router.route('/settings').patch(
  authController.protect,
  debtsHouseController.setZero,
);

Router.route('/:id')
  .get(authController.protect, debtsHouseController.UserDebts)
  .patch(authController.protect, debtsHouseController.updateDebts);
Router.route('/signup').post(authController.signup);
Router.route('/login').post(authController.login);
Router.route('/verify-otp').post(authController.verifyOTP);

module.exports = Router;
