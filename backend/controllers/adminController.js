const User = require("../models/User");
const Product = require("../models/Product");
const Admin = require("../models/Admin");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" })
    .select("-password")
    .sort({ createdAt: -1 });
  res.json(users);
});

const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isBlocked = true;
  await user.save();
  res.json({ message: "User blocked" });
});

const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isBlocked = false;
  await user.save();
  res.json({ message: "User unblocked" });
});

const listListings = asyncHandler(async (req, res) => {
  const listings = await Product.find()
    .populate("seller", "name phone")
    .sort({ createdAt: -1 });
  res.json(listings);
});

const approveListing = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.isApproved = true;
  await product.save();
  res.json({ message: "Listing approved" });
});

const rejectListing = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.isApproved = false;
  await product.save();
  res.json({ message: "Listing rejected" });
});

const removeListing = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Listing removed" });
});

const getStats = asyncHandler(async (req, res) => {
  const [users, listings, blockedUsers, pendingListings] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Product.countDocuments(),
    User.countDocuments({ isBlocked: true }),
    Product.countDocuments({ isApproved: false }),
  ]);

  const admins = await Admin.countDocuments();

  res.json({ users, admins, listings, blockedUsers, pendingListings });
});

module.exports = {
  getUsers,
  blockUser,
  unblockUser,
  listListings,
  approveListing,
  rejectListing,
  removeListing,
  getStats,
};
