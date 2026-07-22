const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

const getJwtSecret = () => process.env.JWT_SECRET;

module.exports.getUserFromToken = async (token) => {
  if (!token || !getJwtSecret()) {
    return null;
  }

  const { id, email } = jwt.verify(token, getJwtSecret());
  return User.findOne({
    _id: id,
    email,
    deleted: { $ne: true },
    status: { $ne: "inactive" }
  });
};

module.exports.attachUser = async (req, res, next) => {
  try {
    const user = await module.exports.getUserFromToken(req.cookies.token);
    if (user) {
      req.user = user;
      res.locals.user = user;
    }
  } catch (error) {
    res.clearCookie("token");
  }

  next();
};

module.exports.requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/user/login");
  }

  next();
};

module.exports.redirectIfAuthenticated = (req, res, next) => {
  if (req.user) {
    return res.redirect("/chat");
  }

  next();
};
