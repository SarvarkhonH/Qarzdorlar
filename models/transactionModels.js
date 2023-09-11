const mongoose = require("mongoose");
const productSchema = require("./productModels");

const transactionsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
  },

  time: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
  },
  products: [productSchema],
});

module.exports = transactionsSchema;
