const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "abcxyz123";

const createUser = async (userInfo, res) => {
  const { username, password, email, address, phoneNumber } = userInfo;
  console.log(username);

  try {
    const [existingUsername] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUsername.length) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password, email, role, address, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
      [username, encryptedPassword, email, "customer", address, phoneNumber]
    );

    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lưu dữ liệu thất bại" });
  }
};

const createAdmin = async (adminInfo, res) => {
  const { username, password, email, address, phoneNumber } = adminInfo;

  try {
    const [existingUsername] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUsername.length) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password, email, role, address, phone_number) VALUES (?, ?, ?, ?, ?, ?)",
      [username, encryptedPassword, email, "admin", address, phoneNumber]
    );

    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Lưu dữ liệu thất bại" });
  }
};

const userLogin = async (userInfo) => {
  const { username, password } = userInfo;
  try {
    const [user] = await db.query(
      "SELECT * FROM users WHERE username = ? AND role = ?",
      [username, "customer"]
    );

    if (!user.length) {
      throw new Error("Username không tồn tại!");
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      throw new Error("Mật khẩu không chính xác!");
    }

    return user[0].user_id;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  createUser,
  createAdmin,
  userLogin,
};
