const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  console.log("Media error handdler");
  logger.error(err.stack);

  res.status(err.status || 5000).json({
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
