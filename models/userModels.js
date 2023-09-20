const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Do'kon egasi kirgizilishi kerak"],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Iltimos telefon raqamizni kiriting'],
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

  hasTrial: {
    type: Boolean,
    default: true,
  },
  endDate: {
    type: Date,
    default: () => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 30);
      return currentDate;
    },
  },
  hasSubscribed: {
    type: Boolean,
    default: false,
  },
  subscriptionendDate: {
    type: Date,
    default: () => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 60);
      return currentDate;
    },
  },
  access: {
    type: Boolean,
    default: true,
  },
  serviceFee: {
    type: Number,
    default: 0,
  },

  alldebts: [{ type: mongoose.Schema.ObjectId, ref: 'debtsHouse' }],
});

exports.user = mongoose.model('userSchema', userSchema);
