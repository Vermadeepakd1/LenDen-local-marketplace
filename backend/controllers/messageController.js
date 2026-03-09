const Message = require("../models/Message");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, productId, content } = req.body;
  if (!recipientId || !content) {
    throw new ApiError(400, "Recipient and content are required");
  }

  const message = await Message.create({
    sender: req.user._id,
    recipient: recipientId,
    product: productId,
    content,
  });

  res.status(201).json(message);
});

const listMessages = asyncHandler(async (req, res) => {
  const { productId } = req.query;
  const filter = {
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  };
  if (productId) {
    filter.product = productId;
  }

  const messages = await Message.find(filter)
    .populate("sender", "name")
    .populate("recipient", "name")
    .populate("product", "title")
    .sort({ createdAt: -1 });

  res.json(messages);
});

module.exports = { sendMessage, listMessages };
