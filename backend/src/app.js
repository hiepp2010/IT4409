// app.js
const express = require("express");
require('dotenv').config();
const helmet = require("helmet");
const xss = require("xss-clean");
const port = 3000;
const app = express();
const routes = require("./index");
const expressSession = require("express-session");
require("./db");

// set security HTTP headers
app.use(helmet());
// sanitize request data
app.use(xss());
// Thêm middleware để parse JSON body
app.use(express.json());
app.use(
  expressSession({
    secret: "abcxyz123",
    resave: false,
    saveUninitialized: false
  })
);

app.use("/", routes);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server đang chạy trên http://localhost:${port}`);
});

module.exports = app;
