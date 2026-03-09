const express = require("express");
const {
  sendMessage,
  listMessages,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, listMessages);
router.post("/", protect, sendMessage);

module.exports = router;
