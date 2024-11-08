// Chạy file này bằng câu lệnh "$env:NODE_ENV="test"; npx mocha ./backend/src/test/auth.test.js" trên bash
"use strict";

const expect = require("expect.js");
const db = require("../db");
const mocha = require("mocha");
const describe = mocha.describe;
const authService = require("../services/auth.service");
require("dotenv").config();


describe("Authentication", async function () {
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
          )
        `,
      done
    );
  });

  after(function (done) {
    // Xóa bảng users sau khi test xong
    db.run("DROP TABLE users", done);
  });
  let username = "user1";
  let password = "123";
  let wrongpassword = "1234";
  let email = "xuanhieu@gmail.com";
  let address = "Ha Noi";
  let phoneNumber = "0335142658";
  let userInfo = { username, password, email, address, phoneNumber };
  describe("functionally", async function () {
    it("create user without error", async function () {
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
      expect(res.statusCode).to.be(201); // Kiểm tra mã trạng thái là 201
    });
    it("unable to create user with existed username", async function () {
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
      expect(res.statusCode).to.be(400); // Kiểm tra mã trạng thái là 201
    });
    it("login success", async function () {
      const userInfo = { username, password };
      await authService.userLogin(userInfo);
    });
    it("login failed with wrong password", async function () {
      const userInfo = { username, password: wrongpassword };
      try {
        await authService.userLogin(userInfo);
      } catch (error) {
        expect(error.message).to.be("Mật khẩu không chính xác!");
      }
    });
  });
});
