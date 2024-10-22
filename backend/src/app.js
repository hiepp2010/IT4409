// app.js
const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const port = 3000;
const app = express();
const routes = require("./index");
require("./db");

// set security HTTP headers
app.use(helmet());
// sanitize request data
app.use(xss());
// Thêm middleware để parse JSON body
app.use(express.json());

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});

module.exports = app;
