const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

const authenticateRequest = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // remove "Bearer "
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId;

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
