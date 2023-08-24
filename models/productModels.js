const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
       type: String,
     },
     unit: {
       type: String,
       enum: ["kg", "dona"],
       required: [true, `maxsulot o'lchovini kiritish kerak`],
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

   productSchema.pre("save",function(next){
    this.totalPrice = this.price * this.quantity
    next()
  })

  module.exports = productSchema;