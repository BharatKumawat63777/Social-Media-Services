const logger = require("../utils/logger");

const authenticateRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    logger.warn("Access attempt without user Id");
    return res.status(501).json({
      success: true,
      message: "Authencation required Please login to continue",
    });
  }

  req.user = { userId };
  next();
};

module.exports = { authenticateRequest };
