const mongoose = require('mongoose');
// const {user} = require('./userModels');
const transactionsSchema = require('./transactionModels');

const debtsHouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Mijoz ismi kiritilishi kerak`],
  },
  address: {
    type: String,
    required: [true, `Mijoz yashaydigan mahala kiritilishi kerak`],
  },

  phoneNumber: {
    type: String,
    required: [true, `Mijozning telefon raqamini kirgizing`],
  },
  reminder: {
    type: Date,
  },
  transactions: [transactionsSchema],
  remain: {
    type: Number,
  },
  time: {
    type: Date,
  },
  serviceFee: {
    type: Number,
  },
});

debtsHouseSchema.pre('save', function (next) {
  if (this.transactions && this.transactions.length > 0) {
    const latestTime = this.transactions.reduce(
      (latest, transaction) =>
        transaction.time > latest ? transaction.time : latest,
      this.transactions[0].time,
    );
    this.time = latestTime;
  }
  next();
});

// debtsHouseSchema.pre('save', function (next) {
//   let totalServiceFee = 0;
//   this.transactions.forEach((transaction) => {
//     if (transaction.serviceFee) {
//       totalServiceFee += transaction.serviceFee;
//     }
//   });

//   this.serviceFee = totalServiceFee;
//   next();
// });

debtsHouseSchema.index(
  { name: 'text', address: 'text', phoneNumber: 'text' },
  { default_language: 'en' },
);

exports.debtsHouse = mongoose.model('debtsHouse', debtsHouseSchema);
