const ApiError = require("../utils/apiError");

const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    throw new ApiError(403, "Insufficient permissions");
  }

  next();
};

module.exports = { requireRole };
