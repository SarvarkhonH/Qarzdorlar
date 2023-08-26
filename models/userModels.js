const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    "name":{
        type: String,
        required:[true,'Iltimos ismingizni kiriting']
    },
    "password":{
        type: String,
        required: [true,'Iltimos parol yarating'],
        minlength: 8,
        select: false,
    },
    "passwordConfirm":{
        type: String,
        required:[true,`Iltimos hozirgina qo'ygan parolizni bu yerga ham yozing`],
        validate: {
            validator: function (val) {
              return val === this.password;
            },
            message: 'Iltimos tepaga va pasga bir xil parol yozing',
          },
    }
})

exports.user = mongoose.model("userSchema",userSchema)