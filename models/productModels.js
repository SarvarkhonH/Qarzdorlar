const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
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
     },
     time: {
       type: Date,
       default: Date.now(),
     },

   },
   );


  module.exports = productSchema;