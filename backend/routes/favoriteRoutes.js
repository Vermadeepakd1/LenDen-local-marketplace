const express = require("express");
const {
  addFavorite,
  removeFavorite,
  listFavorites,
} = require("../controllers/favoriteController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, listFavorites);
router.post("/:productId", protect, addFavorite);
router.delete("/:productId", protect, removeFavorite);

module.exports = router;
