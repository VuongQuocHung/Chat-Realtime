const express = require("express");
const router = express.Router();

const chatController = require("../../controllers/client/chat.controller");

router.get("/", (req, res) => res.redirect("/chat"));
router.get("/chat", chatController.index);

module.exports = router;
