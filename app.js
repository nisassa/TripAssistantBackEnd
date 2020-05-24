const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


mongoose.connect(process.env.db_url, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.on("connected", () => {
    console.log("Successfully connected to MongoDb");
})

connection.on("disconnected", () => {
    console.log("Disconected from MongoDb");
})

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, UPDATE");
        return res.status(200).json({});
    }
    next();
});

// routes
const userAuthRoutes = require("./api/routes/userauthentication");

app.use("/user/authentication", userAuthRoutes)

// handle error when no route were matched
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status(404);
    next(error);
});

// handle erros on opperations
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    }) 
});

module.exports = app;