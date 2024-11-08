// Chạy file này bằng câu lệnh "$env:NODE_ENV="test"; npx mocha ./backend/src/test/orderManagement.test.js" trên bash
"use strict";

const expect = require("expect.js");
const db = require("../db");
const mocha = require("mocha");
const describe = mocha.describe;
const authService = require("../services/auth.service");
const app = require("../app");
const request = require("supertest");
const { addToCart, getCart } = require("../services/cart.service");
require("dotenv").config();


describe("Order management", async function () {
  before(function (done) {
    db.run(
      `
        CREATE TABLE IF NOT EXISTS users (
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
            CREATE TABLE IF NOT EXISTS orders (
              order_id INTEGER PRIMARY KEY AUTOINCREMENT,
              customer_id INTEGER NOT NULL,
              order_date DATETIME NOT NULL,
              total_amount DECIMAL(8, 2) NOT NULL,
              status VARCHAR(255) NOT NULL,
              address TEXT NOT NULL,
              phone_number VARCHAR(255) NOT NULL,
              total_discount DECIMAL(8, 2) NOT NULL
            );
            `,
          function () {
            db.run(
              `
                CREATE TABLE IF NOT EXISTS shopping_cart (
                  cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
                  customer_id INTEGER NOT NULL,
                  product_id INTEGER NOT NULL,
                  quantity INTEGER NOT NULL,
                  UNIQUE(customer_id, product_id),
                  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                `,
              done
            );
          }
        );
      }
    );
  });

  after(function (done) {
    db.run("DROP TABLE IF EXISTS shopping_cart", function () {
      db.run("DROP TABLE IF EXISTS orders", function () {
        db.run("DROP TABLE IF EXISTS users", done);
      });
    });
  });

  let userInfo1 = {
    username: "user1",
    password: "123",
    email: "xuanhieu@gmail.com",
    address: "Ha Noi",
    phoneNumber: "0335142658",
  };
  let userInfo2 = {
    username: "user2",
    password: "123",
    email: "xuanhieu2@gmail.com",
    address: "Ha Noi",
    phoneNumber: "0335142658",
  };
  let product1 = {
    productId: "1",
  };
  let product2 = {
    productId: "2",
  };
  describe("functionally", async function () {
    this.timeout(5000);
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
      await authService.createUser(userInfo1, res);
      await authService.createUser(userInfo2, res);
      await authService.userLogin(userInfo1);
      await request(app).get("/customer/order-management");
    });
    it("add to cart successfully", async function () {
      const { userId } = await authService.userLogin(userInfo1);
      await addToCart({ userId, productId: product1.productId, quantity: 1 });
    });
    it("get cart successfully", async function () {
      const { userId } = await authService.userLogin(userInfo2);

      await addToCart({ userId, productId: product1.productId, quantity: 1 });
      await addToCart({ userId, productId: product2.productId, quantity: 3 });
      await addToCart({ userId, productId: product1.productId, quantity: 1 });

      const result = await getCart(userId);
      expect(result).to.eql([
        {
          cart_id: 2,
          customer_id: userId,
          product_id: product1.productId,
          quantity: 2,
        },
        {
          cart_id: 1,
          customer_id: userId,
          product_id: product2.productId,
          quantity: 3,
        },
      ]);
    });
  });
});
