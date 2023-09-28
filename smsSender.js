/* eslint-disable node/no-unsupported-features/node-builtins */
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config({ path: './config.env' });

async function sendOTP(phoneNumber, otp) {
  console.log(phoneNumber);
  const message = `Qarzdorlar ilovasiga kirish uchun kod raqamingiz: ${otp}`;

  const url = 'https://notify.eskiz.uz/api/message/sms/send'; // Use the correct protocol (https) here

  const bearerToken = process.env.ESKIZ_TOKEN;

  const formData = {
    mobile_phone: phoneNumber.slice(1),
    message,
    from: '4546',
    callback_url: 'http://0000.uz/test.php',
  };

  const headers = {
    Authorization: `Bearer ${bearerToken}`,
  };

  try {
    const response = await axios.post(
      url,
      new URLSearchParams(formData).toString(),
      {
        headers: headers,
      },
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = sendOTP;
