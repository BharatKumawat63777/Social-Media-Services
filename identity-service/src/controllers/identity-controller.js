// user registration
const generateTokens = require("../utils/generateToken");
const logger = require("../utils/logger");
const { validateRegistration, validatelogin } = require("../utils/validation");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

const resgiterUser = async (req, res) => {
  logger.info("Registration endpoint hit...");

  try {
    //validate the Schema

    const { error } = validateRegistration(req.body);

    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password, username } = req.body;

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      logger.warn("User already exists");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({ username, email, password });
    await user.save();

    logger.warn("User saved successfully", user._id);

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Registration error occured");
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//user login
const loginUser = async (req, res) => {
  logger.info("Login endpoint hit...");
  try {
    const { error } = validatelogin(req.body);

    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("This user is not found");
      return res.status(400).json({
        success: false,
        message: "User doesn't exict, Please first Register ",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      logger.warn("Password Invalid");
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.json({
      accessToken,
      refreshToken,
      userId: user._id,
    });
  } catch (error) {
    logger.error("Login error occured", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//refresh token
const refreshTokenUser = async (req, res) => {
  logger.info("refreshToken endpoint ...");
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      logger.warn("Refresh token misssing");
      res.status(400).json({
        success: false,
        message: "Refresh token misssing",
      });
    }

    const storeToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storeToken || storeToken.expiresAt < new Date()) {
      logger.warn("Invalid or expired refresh token");
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = await User.findById(storeToken.user);

    if (!user) {
      logger.warn("User not found");
      res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(user);

    await RefreshToken.deleteOne({ _id: storeToken._id });
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    logger.error("refreshToken generate error occured ", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//logout
const logoutUser = async (req, res) => {
  logger.info("Logout endpoints ...");
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      logger.warn("Refresh token misssing");
      res.status(400).json({
        success: false,
        message: "Refresh token misssing",
      });
    }

    await RefreshToken.deleteOne({ token: refreshToken });
    logger.info("Refresh token deleted for logout");

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error("logout error occured ", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { resgiterUser, loginUser, refreshTokenUser,logoutUser };
