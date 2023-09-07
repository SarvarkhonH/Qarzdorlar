const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "dukon egasi kirgizilishi kerak"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Iltimos telefon raqamizni kiriting"],
    unique: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  generatedOTP: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default:true
  },

  // subscriptionPaid: {
  //   type: Boolean,
  //   default: false, // Set to true when the user has an active subscription
  // },
  // lastPaymentDate: {
  //   type: Date, // Store the date of the last payment
  // },

  alldebts: [{ type: mongoose.Schema.ObjectId, ref: 'debtsHouse' }]
});


exports.user = mongoose.model("userSchema",userSchema)
