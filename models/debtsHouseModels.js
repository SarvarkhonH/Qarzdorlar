const mongoose = require("mongoose");
const calculateDebtsAndRemaining = require("../utils/debtsCalculator");

const productSchema = require("./productModels");
const paymentSchema = require("./paymentModels");

const debtsHouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `mijoz ismi kiritilishi kerak`],
  },
  address: {
    type: String,
    required: [true, `mijoz yashaydigan mahala kiritilishi kerak`],
  },
  phoneNumber: String,
  time: {
    type: Date,
    default: Date.now(),
  },
  reminder: {
    type: Date,
    required: [true,'Mijozni qarzni qaytarish vaxtini kirgizish kerak']
  },
  payment:[paymentSchema],
  debts: {
    type: Number,
    default: 0,
  },
  remain: {
    type: Number,
    default: 0,
  },
  products: [productSchema],
  
});

debtsHouseSchema.methods.updateDebtsAndRemaining = async function () {
  try {
    const { debts, remain } = calculateDebtsAndRemaining(this.products, this.payment);
    this.debts = debts;
    this.remain = remain;
    await this.save();
  } catch (error) {
    throw error;
  }
};

exports.debtsHouse = mongoose.model("debtsHouse", debtsHouseSchema);
