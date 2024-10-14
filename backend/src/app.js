const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const path = require("path");
const ApiError = require("./utils/ApiError");

const app = express();

// set security HTTP headers
app.use(helmet());
// sanitize request data
app.use(xss());
app.use("/", routes);

// handle error
app.use(errorHandler);

module.exports = app;
