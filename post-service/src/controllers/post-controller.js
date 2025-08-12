const Post = require("../models/post");
const logger = require("../utils/logger");
const { validateCreatePost } = require("../utils/validation");

const createPost = async (req, res) => {
  logger.info("Creating post endpoint ...");
  try {
    const { error } = validateCreatePost(req.body);

    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);

    if (cachedPosts) { 
      return res.json(JSON.parse(cachedPosts));
    }

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalNoOfPosts = await Post.countDocuments();

    const result = {
      posts,
      currentpage: page,
      totalPages: Math.ceil(totalNoOfPosts / limit),
      totalPosts: totalNoOfPosts,
    };

    //save your posts in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));

    res.json(result);
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
