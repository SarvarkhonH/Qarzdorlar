const mongoose = require("mongoose");
const dotenv = require('dotenv')

dotenv.config({path: './config.env'});
const app = require("./app");

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
  })
  .then(() => console.log("DB connection succesfull"));
  
  app.listen( process.env.PORT, () => {
  console.log(`App running on port ${ process.env.PORT}...`);
});


