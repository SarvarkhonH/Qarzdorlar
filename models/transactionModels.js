const mongoose = require("mongoose");
const productSchema = require("./productModels");

transactionsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
  },

  time: {
    type: Date,
    default: Date.now,
  },

  products: [productSchema],
});

module.exports = transactionsSchema;
