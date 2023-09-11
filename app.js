const express = require("express");
const cors = require("cors");
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(cors());
app.use(express.json())
// Set security HTTP headers
app.use(helmet())


const debtsHouse = require(`./routes/debtsHouseRoute`);


const limiter = rateLimit({
  max: 250,
  windowMs: 60*60*1000,
  massage: `juda ko'p urunishlar iltimos bir soatdan keyen urinib ko'ring` 
})
app.use('/api',limiter)

// Body parser,reading data from body into req.body
app.use(express.json({limit: '10kb'}))

//Data sanitization against NoSQL query injection
app.use(mongoSanitize())

//Data sanitization against  xss
app.use(xss())

// Routes
app.use(`/api/v1/debtshouse`, debtsHouse);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
  app.use(globalErrorHandler);

module.exports = app;
