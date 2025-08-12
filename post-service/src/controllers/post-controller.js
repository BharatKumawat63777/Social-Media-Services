const logger = require("../utils/logger");

const createPost = async (req, res) => {
  try {
    const { content, mediaIds } = req.body;
    const newlyCreatedPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });

    await newlyCreatedPost.save();
    logger.info("Post created successfully", newlyCreatedPost);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (error) {
    logger.error("Error in Creating post");
    res.status(500).json({
      success: false,
      message: "Error in creating post",
    });
  }
};

const getAllposts = async (req, res) => {
  try {
  } catch (error) {
    logger.error("Error fetching posts");
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
    });
  }
};

const Deletepost = async (req, res) => {
  try {
  } catch (error) {
    logger.error("Error Deleting posts");
    res.status(500).json({
      success: false,
      message: "Error Deleting posts",
    });
  }
};

module.exports = { getAllposts, Deletepost, createPost };
