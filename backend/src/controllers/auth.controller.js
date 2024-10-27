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
    const { sessionToken, userId } = await authService.userLogin(userInfo);
    res.cookie("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24h
    });
    res.status(200).json({ message: "Login successfully !", userId , sessionToken });
  } catch (error) {
    res.status(403).json({message: `${error}`});
  }
};

const adminLogin = async (req, res) => {
  const userInfo = req.body;

  try {
    const { sessionToken } = await authService.adminLogin(userInfo);
    res.cookie("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24h
    });
    res.status(200).json({ message: "Login successfully !", userId , sessionToken });
  } catch (error) {
    res.status(403).json({message: `${error}`});
  }
};

const logout = async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;

    if (!sessionToken) {
      return res.status(400).json({
        error: "No active session",
      });
    }

    await db.query("UPDATE sessions SET is_valid = false WHERE token = ?", [
      sessionToken,
    ]);

    res.clearCookie("session_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      error: "Error during logout",
    });
  }
};

module.exports = {
  userRegister,
  adminRegister,
  userLogin,
  adminLogin,
  logout,
};
