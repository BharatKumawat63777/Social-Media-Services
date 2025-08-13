const express = require("express");
const {
  createPost,
  getAllposts,
  getPost,
  Deletepost,
} = require("../controllers/post-controller");
const { authenticateRequest } = require("../middleware/authMiddleware");

const router = express();

router.use(authenticateRequest);

router.post("/create-post", createPost);
router.get("/all-posts", getAllposts);
router.get("/:id", getPost);
router.delete("/:id", Deletepost);

module.exports = router;
