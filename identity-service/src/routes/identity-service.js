const express = require("express");
const {
  resgiterUser,
  refreshTokenUser,
  logoutUser,
  loginUser,
} = require("../controllers/identity-controller");

const router = express.Router();

router.post("/register", resgiterUser);
router.post("/login", loginUser);
router.post("/refreshToken", refreshTokenUser);
router.post("/logout", logoutUser);

module.exports = router;
