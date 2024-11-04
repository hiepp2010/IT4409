// Chạy file này bằng câu lệnh "$env:NODE_ENV="test"; npx mocha ./backend/src/test/auth.test.js" trên bash
"use strict";

const expect = require("expect.js");
const db = require("../db");
const mocha = require("mocha");
const describe = mocha.describe;
const authService = require("../services/auth.service");
function expectReject(promise) {
  return promise.then(
    (result) =>
      expect().fail(`Expected failure, but function returned ${result}`),
    (error) => {}
  );
}

describe("Authentication", async function () {
  before(function (done) {
    // Tạo bảng users cho testing
    db.run(
      `
          CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT,
            email TEXT,
            role TEXT,
            address TEXT,
            phone_number TEXT
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
    })
  });
});
