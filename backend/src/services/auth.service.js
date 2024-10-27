const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const createUser = async (userInfo, res) => {
  const { username, password, email, address, phoneNumber } = userInfo;

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
const generateSessionToken = async (user) => {
  const randomBytes = crypto.randomBytes(32);
  const sessionId = randomBytes.toString("hex");
  return jwt.sign(
    {
      sessionId,
      userId: user.user_id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
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

    const sessionToken = await generateSessionToken(user[0]);
    return {
      sessionToken,
      userId: user[0].user_id
    };
  } catch (error) {
    throw error;
  }
};

const adminLogin = async (userInfo) => {
  const { username, password } = userInfo;
  try {
    const [user] = await db.query(
      "SELECT * FROM users WHERE username = ? AND role = ?",
      [username, "admin"]
    );

    if (!user.length) {
      throw new Error("Username không tồn tại!");
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      throw new Error("Mật khẩu không chính xác!");
    }

    const sessionToken = await generateSessionToken(user[0]);
    return {
      sessionToken,
      userId: user[0].user_id
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  createAdmin,
  userLogin,
  adminLogin,
};
