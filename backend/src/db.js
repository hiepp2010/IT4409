const mysql = require("mysql2");
const sqlite3 = require("sqlite3");

let db;

if (process.env.NODE_ENV === "test") {
  // Sử dụng SQLite in-memory cho môi trường test
  db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
      console.error("Could not connect to SQLite in-memory database", err);
    } else {
      // eslint-disable-next-line no-console
      console.info("Connected to SQLite in-memory database");
    }
  });

  // Promisify các hàm SQLite để dùng với async/await
  db.query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };
} else {
  // Sử dụng MySQL cho các môi trường khác
  const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: "fashion_web",
    connectionLimit: 10
  });

  // Để sử dụng promise thay vì callback
  db = pool.promise();
}

module.exports = db;
