const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "",
  database: "fashion_web",
  connectionLimit: 10
});

// Để sử dụng promise thay vì callback
const promisePool = pool.promise();

module.exports = promisePool;