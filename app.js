const express = require("express");
const cors = require("cors");
const rateLimit = require('express-rate-limit')

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(cors());
app.use(express.json())




const debtsHouse = require(`./routes/debtsHouseRoute`);
const imageUpload =  require('./routes/imageRoute');

const limiter = rateLimit({
  max: 2,
  windowMs: 60*60*1000,
  massage: `juda ko'p urunishlar iltimos bir soatdan keyen urinib ko'ring` 
})
app.use('/api',limiter)

app.use(`/api/v1/debtshouse`, debtsHouse,imageUpload);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
  app.use(globalErrorHandler);

module.exports = app;
