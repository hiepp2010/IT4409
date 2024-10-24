const httpStatus = require("http-status");
const authService = require("../services/auth.service");

const userRegister = async (req, res) => {
  const userInfo = req.body;
  await authService.createUser(userInfo, res);
};

const adminRegister = async (req, res) => {
  const adminInfo = req.body;
  await authService.createAdmin(adminInfo, res);
};

const userLogin = async (req, res) => {
  const userInfo = req.body;
  try {
    req.session.userId = await authService.userLogin(userInfo);
    res.status(200).json("Login successfully !");
  } catch (error) {
    console.error(error);
    res.status(403).json("Login failed");
  }
};

const logout = async (req, res) => {
  req.session.destroy(() => {
    res.status(200).json("You are logged out ! ");
  });
};

module.exports = {
  userRegister,
  adminRegister,
  userLogin,
  logout,
};
