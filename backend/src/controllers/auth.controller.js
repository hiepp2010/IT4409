const httpStatus = require("http-status");
const userService = require('../services/user.services')
const register = async (req, res) => {
  // TODO : finish this
  await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: "User created successfully !",
  });
};

const login = async (req, res) => {
  // TODO : finish this
  const { phone, password } = req.body;
  const clientLanguage = _.get(req, "headers.lang") || language.english;
  const user = await authService.loginUserWithPhoneAndPassword({
    phone,
    password,
    clientLanguage,
  });
  const accessToken = await tokenService.generateAuthTokens(user);
  res.send({
    code: httpStatus.OK,
    message: "Login successfully!",
    result: { user, accessToken },
  });
};

const logout = async (req, res) => {
  // TODO : finish this
  const { fcmToken, userId } = req.body;
  await authService.logOut({ userId, fcmToken });
  res.send({
    code: httpStatus.OK,
    message: "Bye bye!",
  });
};

module.exports = {
  register,
  login,
  logout,
};
