const express = require("express");
const router = express.Router();

const chatRoutes = require("./chat.route");

router.get("/", (req, res) => res.redirect("/chat"));
router.use("/chat", chatRoutes);

module.exports = router;
