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
  before(async function () {
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) DEFAULT NULL,
        role VARCHAR(255) NOT NULL DEFAULT 'customer' CHECK(role IN ('admin', 'customer')),
        address TEXT NOT NULL,
        phone_number VARCHAR(255) NOT NULL
      )`);

    await db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        order_date DATETIME NOT NULL,
        total_amount DECIMAL(8, 2) NOT NULL,
        status VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        phone_number VARCHAR(255) NOT NULL,
        total_discount DECIMAL(8, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

    await db.run(`
      CREATE TABLE IF NOT EXISTS shopping_cart (
        cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        UNIQUE(customer_id, product_id)
      )`);

    await db.run(`
      CREATE TABLE IF NOT EXISTS products (
        product_id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(8, 2) NOT NULL,
        stock_quantity INTEGER NOT NULL,
        category VARCHAR(255) NOT NULL,
        color VARCHAR(255) NOT NULL,
        size VARCHAR(255) NOT NULL,
        image_path VARCHAR(255) NOT NULL,
        skucode VARCHAR(255) NOT NULL
      )`);
  });

  after(async function () {
    await db.run("DROP TABLE IF EXISTS shopping_cart");
    await db.run("DROP TABLE IF EXISTS orders");
    await db.run("DROP TABLE IF EXISTS users");
    await db.run("DROP TABLE IF EXISTS products");
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
    productName: "shirt",
    price: 1,
    stockQuantity: 1000,
    category: "SHIRT",
    color: "RED",
    size: "XL",
    skuCode: "XLXX",
  };
  let product2 = {
    productName: "pants",
    price: 3,
    stockQuantity: 500,
    category: "PANTS",
    color: "BLUE",
    size: "L",
    skuCode: "XLXX1",
  };
  let productWithExistedSkuCode = {
    productName: "pants",
    price: 3,
    stockQuantity: 500,
    category: "PANTS",
    color: "BLUE",
    size: "L",
    image: "vlxx",
    skuCode: "XLXX1",
  };
  let productToTestDeleteApi = {
    productName: "pants",
    price: 3,
    stockQuantity: 500,
    category: "PANTS",
    color: "BLUE",
    size: "L",
    image: "vlxx",
    skuCode: "XLXX2",
    imagePath:
      "C:\\Users\\Admin\\Downloads\\8e5e27b7-da0a-43b2-938e-dc410c5c5eee.jfif",
  };
  const imagePath1 =
    "C:\\Users\\Admin\\Downloads\\8e5e27b7-da0a-43b2-938e-dc410c5c5eee.jfif";
  const imagePath2 = "C:\\Users\\Admin\\Downloads\\IMG_9037 (1).jpg";
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
      await authService.createUser(userInfo1, res);
      await authService.createUser(userInfo2, res);
      await authService.userLogin(userInfo1);
      await request(app).get("/customer/order-management");
    });

    it("create product successfully!", async () => {
      const createProductRequest1 = product1;
      await request(app)
        .post("/admin/product/createProduct")
        .field("productName", createProductRequest1.productName)
        .field("price", createProductRequest1.price)
        .field("stockQuantity", createProductRequest1.stockQuantity)
        .field("category", createProductRequest1.category)
        .field("color", createProductRequest1.color)
        .field("size", createProductRequest1.size)
        .field("skuCode", createProductRequest1.skuCode)
        .attach("image", imagePath2)
        .expect(200); // Gửi file ảnh
    });

    it("create product failed!", async () => {
      const createExistedSkucodeProductRequest = productWithExistedSkuCode;
      try {
        await request(app)
          .post("/admin/product/createProduct")
          .send(createExistedSkucodeProductRequest);
      } catch (err) {
        expect(err).to.eql("Existed products with the same skucode!");
      }
    });

    it("edit product successfully!", async () => {
      const createProductRequest1 = product1;
      await request(app)
        .post("/admin/product/editProduct")
        .field("productName", createProductRequest1.productName)
        .field("price", createProductRequest1.price)
        .field("stockQuantity", 10000)
        .field("category", createProductRequest1.category)
        .field("color", createProductRequest1.color)
        .field("size", createProductRequest1.size)
        .field("skuCode", createProductRequest1.skuCode)
        .attach("image", imagePath2)
        .expect(200); // Gửi file ảnh
    });
    it("edit product failed!", async () => {
      try {
        const createProductRequest1 = product1;
        await request(app)
          .post("/admin/product/editProduct")
          .field("productName", createProductRequest1.productName)
          .field("price", createProductRequest1.price)
          .field("stockQuantity", 10000)
          .field("category", createProductRequest1.category)
          .field("color", createProductRequest1.color)
          .field("size", createProductRequest1.size)
          .field("skuCode", "WTF@")
          .attach("image", imagePath2); // Gửi file ảnh
      } catch (err) {
        expect(err).to.eql(
          "Product with the corresponding SKU code does not exist"
        );
      }
    });
    it("delete product successfully!", async () => {
      await request(app)
        .post("/admin/product/createProduct")
        .field("productName", productToTestDeleteApi.productName)
        .field("price", productToTestDeleteApi.price)
        .field("stockQuantity", 10000)
        .field("category", productToTestDeleteApi.category)
        .field("color", productToTestDeleteApi.color)
        .field("size", productToTestDeleteApi.size)
        .field("skuCode", productToTestDeleteApi.skuCode)
        .attach("image", productToTestDeleteApi.imagePath)
        .expect(200);
      await request(app)
        .post("/admin/product/deleteProduct")
        .send(productToTestDeleteApi)
        .expect(200);
    });
    it("delete product failed!", async () => {
      let productWithNonExistedSkuCode = productWithExistedSkuCode;
      try {
        await request(app)
          .post("/admin/product/deleteProduct")
          .send(productWithNonExistedSkuCode);
      } catch (err) {
        expect(err).to.eql(
          "Product with the corresponding SKU code does not exist"
        );
      }
    });
    it("add to cart successfully", async function () {
      const { userId } = await authService.userLogin(userInfo1);
      await addToCart({
        userId,
        productId: 1,
        quantity: 1,
      });
      expect(200);
    });

    it("get cart successfully", async function () {
      const { userId } = await authService.userLogin(userInfo2);

      await addToCart({ userId, productId: 1, quantity: 1 });
      await addToCart({ userId, productId: 2, quantity: 3 });
      await addToCart({ userId, productId: 1, quantity: 1 });

      const result = await getCart(userId);
      expect(result).to.eql([
        { cart_id: 1, customer_id: 2, product_id: 1, quantity: 2 },
        { cart_id: 2, customer_id: 2, product_id: 2, quantity: 3 },
      ]);
    });
  });
});
