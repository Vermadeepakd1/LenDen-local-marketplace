const Favorite = require("../models/Favorite");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const addFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product is required");
  }

  await Favorite.updateOne(
    { user: req.user._id, product: productId },
    { $set: { user: req.user._id, product: productId } },
    { upsert: true },
  );

  res.status(201).json({ message: "Added to favorites" });
});

const removeFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  await Favorite.deleteOne({ user: req.user._id, product: productId });
  res.json({ message: "Removed from favorites" });
});

const listFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id })
    .populate({
      path: "product",
      populate: { path: "seller", select: "name phone" },
    })
    .sort({ createdAt: -1 });
  res.json(favorites);
});

module.exports = { addFavorite, removeFavorite, listFavorites };
