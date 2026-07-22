const express = require("express");
const router = express.Router();

const homeController = require("../../controllers/client/home.controller");
const userController = require("../../controllers/client/user.controller");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const chatRoutes = require("./chat.route");

router.get("/", homeController.index);

router.get("/user/register", authMiddleware.redirectIfAuthenticated, userController.register);
router.post("/user/register", authMiddleware.redirectIfAuthenticated, userController.registerPost);
router.get("/user/login", authMiddleware.redirectIfAuthenticated, userController.login);
router.post("/user/login", authMiddleware.redirectIfAuthenticated, userController.loginPost);
router.post("/user/logout", authMiddleware.requireAuth, userController.logoutPost);

router.use("/chat", authMiddleware.requireAuth, chatRoutes);

module.exports = router;
