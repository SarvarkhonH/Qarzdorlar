const dotenv = require('dotenv');
const axios = require('axios');

const sendOTP = async (phoneNumber, otp) => {
  const url = `https://${process.env.DOMAIN}/sms/2/text/advanced`;
  const message = `Qarzdorlar ilovasiga kirish uchun kod raqamingiz: ${otp}`;
  const requestBody = {
    messages: [
      {
        destinations: [{ to: phoneNumber }],
        text: message,
      },
    ],
  };
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `App ${process.env.APIKEY}`,
  };
  
  try {
    const response = await axios.post(url, requestBody, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

module.exports = sendOTP;
