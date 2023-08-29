const jwt = require('jsonwebtoken')
user = require('../models/userModels')

exports.signup = async (req,res,) =>{
    const newUser = await user.create(
        name = req.body.name,
        password =req.body.password,
        passwordConfirm = req.body.passwordConfirm
    )
    res.status(201).json({
        status: 'succes',
        token,
        data: {
            user: newUser
        }
    })
}
