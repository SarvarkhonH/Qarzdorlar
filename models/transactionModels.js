const mongoose = require("mongoose");

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
  products: [{
    name: {
       type: String,
     },
     price: {
       type: Number,
     },
     quantity: {
       type: Number,
     },
     totalPrice: {
       type: Number
     }
   }],
   
   serviceFee: {
    type: Number,
   }
});

module.exports = transactionsSchema;
