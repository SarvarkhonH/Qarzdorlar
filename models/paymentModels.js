const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    payment:{
      type: Number,
      default: 0,
    },
  
    time: {
      type: Date,
      default: Date.now
    }
  })

  module.exports = paymentSchema;