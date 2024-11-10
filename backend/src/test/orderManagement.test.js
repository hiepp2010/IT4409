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
    this.timeout(0);
    // Tạo bảng users
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT DEFAULT NULL,
        role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('admin', 'customer')),
        address TEXT NOT NULL,
        phone_number TEXT NOT NULL
      )
    `);
    const usersTableExists = await db.query("PRAGMA table_info(users);");
    if (!usersTableExists.length) {
      throw new Error("Failed to create 'users' table");
    }
    // Tạo bảng orders
    await db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        total_amount DECIMAL(8, 2) NOT NULL,
        status VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        phone_number VARCHAR(255) NOT NULL,
        total_discount DECIMAL(8, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);

    // Tạo bảng shopping_cart
    await db.run(`
      CREATE TABLE IF NOT EXISTS shopping_cart (
        cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        UNIQUE(customer_id, product_id)
      )`);

    // Tạo bảng products
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

    await db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          order_items_id INTEGER PRIMARY KEY AUTOINCREMENT,
          discount_id TEXT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          price DECIMAL(8, 2) NOT NULL,
          discount_amount DECIMAL(8, 2),
          payment_amount DECIMAL(8, 2)
        )
      `);

    // Tạo người dùng sau khi các bảng đã sẵn sàng
    await authService.createUser(userInfo1);
    await authService.createUser(userInfo2);
  });

  after(async function () {
    await db.run("DROP TABLE IF EXISTS shopping_cart");
    await db.run("DROP TABLE IF EXISTS orders");
    await db.run("DROP TABLE IF EXISTS users");
    await db.run("DROP TABLE IF EXISTS products");
    await db.run("DROP TABLE IF EXISTS order_items");
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
    productId: 1,
    productName: "shirt",
    price: 1,
    stockQuantity: 1000,
    category: "SHIRT",
    color: "RED",
    size: "XL",
    skuCode: "XLXX",
  };
  let product2 = {
    productId: 2,
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
      this.timeout(0);
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

    it("order successfully", async () => {
      const { userId } = await authService.userLogin(userInfo1);
      const orderRequest = {
        customerId: userId,
        items: [
          {
            productId: product1.productId,
            quantity: 1000,
            price: product1.price,
          },
        ],
        totalAmount: product1.price * 2,
        paymentMethod: "cod",
      };
      await request(app).post("/orders/create").send(orderRequest).expect(200);
    });

    it("update order status successfully", async () => {
      const { userId } = await authService.userLogin(userInfo2);
      const orderRequest = {
        customerId: userId,
        items: [
          {
            productId: product1.productId,
            quantity: 229,
            price: product1.price,
          },
        ],
        totalAmount: product1.price * 2,
        paymentMethod: "cod",
      };
      const orderDetail = await request(app)
        .post("/orders/create")
        .send(orderRequest)
        .expect(200);
      const updateOrderStatusRequest = {
        orderId: orderDetail._body.data.id,
        status: "completed",
      };
      await request(app)
        .post("/admin/orderDetail/updateOrderStatus")
        .send(updateOrderStatusRequest)
        .expect(200);
    });

    it("get order detail by id successfully", async () => {
      let { userId } = await authService.userLogin(userInfo2);
      let orderRequest = {
        customerId: userId,
        items: [
          {
            productId: product1.productId,
            quantity: 2,
            price: product1.price,
          },
        ],
        totalAmount: product1.price * 2,
        paymentMethod: "cod",
      };
      const orderDetail = await request(app)
        .post("/orders/create")
        .send(orderRequest)
        .expect(200);

      const orderId = orderDetail._body.data.id;
      await request(app).get(`/admin/orderDetail/${orderId}`).expect(200);
    });

    it("get order history successfully", async () => {
      this.timeout(5000);
      const { userId } = await authService.userLogin(userInfo1);
      const orderRequest = {
        customerId: userId,
        items: [
          {
            productId: product1.productId,
            quantity: 2,
            price: product1.price,
          },
        ],
        totalAmount: product1.price * 2,
        paymentMethod: "cod",
      };
      await request(app).post("/orders/create").send(orderRequest).expect(200);

      const getOrderHistoryRequest = {
        itemPerPage: 3,
        pageNumber: 2,
      };
      await request(app)
        .post("/admin/lastest-order")
        .send(getOrderHistoryRequest)
        .expect(200);
    });
  });
});
