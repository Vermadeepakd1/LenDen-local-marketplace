const express = require("express");
const {
  getMe,
  updateMe,
  getMyListings,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.get("/me/listings", protect, getMyListings);

module.exports = router;
