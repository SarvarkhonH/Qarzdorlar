const express = require("express");
const cors = require("cors");
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(cors());
app.use(express.json())




const debtsHouse = require(`./routes/debtsHouseRoute`);
const imageUpload =  require('./routes/imageRoute')

app.use(`/api/v1/debtshouse`, debtsHouse,imageUpload);


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
  app.use(globalErrorHandler);

module.exports = app;
