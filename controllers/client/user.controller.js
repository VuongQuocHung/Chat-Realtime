const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
};

module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký"
  });
};

module.exports.registerPost = async (req, res) => {
  const { fullName, email, password } = req.body;
  const existUser = await User.findOne({
    email: email
  });

  if (existUser) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    });
    return;
  }

  // Mã hóa mật khẩu với bcryptjs
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    status: "active"
  });

  await newUser.save();

  res.json({
    code: "success",
    message: "Đăng ký thành công"
  });
};

module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập"
  });
};

module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body;
  const existUser = await User.findOne({
    email: email
  });

  if (!existUser) {
    res.json({
      code: "error",
      message: "Email không tồn tại"
    });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, existUser.password);

  if (!isPasswordValid) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng"
    });
    return;
  }

  if (existUser.status !== "active" || existUser.deleted) {
    res.json({
      code: "error",
      message: "Tài khoản không hoạt động"
    });
    return;
  }

  const token = jwt.sign(
    {
      id: existUser.id,
      email: existUser.email
    },
    getJwtSecret(),
    {
      expiresIn: rememberPassword ? "7d" : "1d"
    }
  );

  res.cookie("token", token, {
    maxAge: rememberPassword
      ? 7 * 24 * 60 * 60 * 1000
      : 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({
    code: "success",
    message: "Đăng nhập thành công!"
  });
};

module.exports.logoutPost = (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  });
};
