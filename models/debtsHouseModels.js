const mongoose = require("mongoose");

const transactionsSchema = require("./transactionModels");

const debtsHouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `mijoz ismi kiritilishi kerak`],
  },
  address: {
    type: String,
    required: [true, `mijoz yashaydigan mahala kiritilishi kerak`],
  },

  phoneNumber: {
    type: String,
    required: [true, `mijozning telefon raqamini kirgizing`],
  },

  time: {
    type: Date,
    default: Date.now(),
  },
  reminder: {
    type: Date,
  },
  reminderDays: {
    type: Number,
  },
  transactions: [transactionsSchema],
  remain: {
    type: Number,
  },
});

debtsHouseSchema.pre("save", function (next) {
  if (this.isNew && this.reminderDays) {
    const newReminderDate = new Date();
    newReminderDate.setDate(newReminderDate.getDate() + this.reminderDays);

    this.reminder = newReminderDate;
  }

  next();
});

debtsHouseSchema.index(
  { name: "text", address: "text", phoneNumber: "text" },
  { default_language: "en" }
);



exports.debtsHouse = mongoose.model('debtsHouse',debtsHouseSchema)