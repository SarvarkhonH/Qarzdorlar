const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { user } = require('../models/userModels');
const sendOTP = require('../smsSender');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const checkAndUpdateSubscription = async (currentUser) => {
  const currentDate = new Date();

  if (currentUser.hasTrial && currentUser.endDate <= currentDate) {
    currentUser.hasTrial = false;
    currentUser.hasSubscribed = true;
  }

  if (
    currentUser.hasSubscribed &&
    currentUser.subscriptionendDate <= currentDate
  ) {
    currentUser.hasSubscribed = false;
    currentUser.access = false;
  }

  await currentUser.save();
};
// 6 xonali raqam generatsiya qilib beradi
function OTPgenerator() {
  return Math.floor(100000 + Math.random() * 900000);
}

exports.signup = catchAsync(async (req, res, next) => {
  const { name, phoneNumber } = req.body;
  const generatedOTP = OTPgenerator();
  await user.create({
    phoneNumber,
    name,
    generatedOTP: generatedOTP,
  });

  if (await sendOTP(phoneNumber, generatedOTP)) {
    res.status(201).json({
      phoneNumber,
      status: 'success',
      message: 'OTP sent successfully for signup',
    });
  } else {
    return next(new AppError('Failed to send OTP', 500));
  }
});

exports.login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const existingUser = await user.findOne({ phoneNumber });

    if (existingUser) {
      const newOTP = OTPgenerator();

      existingUser.generatedOTP = newOTP;
      existingUser.save();

      const response = await sendOTP(phoneNumber, newOTP);

      if (response) {
        res.status(200).json({
          phoneNumber,
          status: 'success',
          message: 'OTP sent successfully for login',
        });
      } else {
        res.status(500).json({ error: 'Failed to send OTP' });
      }
    } else {
      const message = `Bu raqam tizimda ro'yxatdan o'tkazilmagan`;

      res.status(400).json({
        status: 'fail',
        message,
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const currentUser = await user.findOne({ phoneNumber });

    if (currentUser && +otp === currentUser.generatedOTP) {
      currentUser.verified = true;
      await currentUser.save();
      const token = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXP,
      });

      res.status(200).json({
        status: 'success',
        message: 'OTP verified successfully',
        token,
        data: {
          user: currentUser,
        },
      });
    } else {
      res.status(400).json({ error: 'Incorrect OTP' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await user.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  if (req.url !== '/settings' && req.url !== '/payment') {
    await checkAndUpdateSubscription(currentUser);

    const qarzdor = await user.findById(currentUser);
    const payment = qarzdor.serviceFee;

    if (!currentUser.access) {
      const errorMessage = `Dasturdan foydalanish uchun to'lov qiling. Payment amount: $" + ${payment}`;

      return next(new AppError(errorMessage, 403));
    }
  }
  // Ruxsat
  req.user = currentUser;

  next();
});
