const ApiError = require("../utils/apiError");

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Server error";

  if (err instanceof ApiError) {
    return res.status(status).json({ message });
  }

  return res.status(status).json({ message });
};

module.exports = errorHandler;
