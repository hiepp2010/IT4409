// Chạy file này bằng câu lệnh "$env:NODE_ENV="test"; npx mocha ./backend/src/test/auth.test.js" trên bash
"use strict";

const expect = require("expect.js");
const db = require("../db");
const mocha = require("mocha");
const describe = mocha.describe;
const authService = require("../services/auth.service");
const app = require('../app')
const request = require("supertest");
require("dotenv").config();

function expectReject(promise) {
  return promise.then(
    (result) =>
      expect().fail(`Expected failure, but function returned ${result}`),
    (error) => {}
  );
}

describe("Order management", async function () {
  before(function (done) {
    // Tạo bảng users cho testing
    db.run(
      `
            CREATE TABLE users (
              user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
              username VARCHAR(255) NOT NULL,
              password VARCHAR(255) NOT NULL,
              email VARCHAR(255) DEFAULT NULL,
              role VARCHAR(255) NOT NULL DEFAULT 'customer' CHECK(role IN ('admin', 'customer')),
              address TEXT NOT NULL,
              phone_number VARCHAR(255) NOT NULL
            );
          `,
      function () {
        db.run(
          `
                CREATE TABLE orders (
                  order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                  customer_id INT NOT NULL,
                  order_date DATETIME NOT NULL,
                  total_amount DECIMAL(8, 2) NOT NULL,
                  status VARCHAR(255) NOT NULL,
                  address TEXT NOT NULL,
                  phone_number VARCHAR(255) NOT NULL,
                  total_discount DECIMAL(8, 2) NOT NULL
                );
              `,
          done
        );
      }
    );
  });

  after(function (done) {
    // Xóa bảng users sau khi test xong
    db.run("DROP TABLE users", function () {
        db.run("DROP TABLE orders", done);
      });
  });
  let username = "user1";
  let password = "123";
  let wrongpassword = "1234";
  let email = "xuanhieu@gmail.com";
  let address = "Ha Noi";
  let phoneNumber = "0335142658";
  let userInfo = { username, password, email, address, phoneNumber };
  describe("functionally", async function () {
    it("get order detail successfully", async function () {
      const res = {
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
          this.data = data;
          return this;
        },
      };
      await authService.createUser(userInfo, res);
      await authService.userLogin(userInfo);
      await request(app).get('/customer/order-management')
    });
  });
});
