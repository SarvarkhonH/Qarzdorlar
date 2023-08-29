const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json())

const debtsHouse = require(`./routes/debtsHouseRoute`);
app.use(`/api/v1/debtshouse`, debtsHouse);

app.all('*',(req,res,next) => {
    res.status(404).json({
        status: 'fail',
        message: `cannot find ${req.originalUrl} on this server`
    })
})

module.exports = app;
