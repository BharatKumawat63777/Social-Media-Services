const Post = require("../models/post");
const logger = require("../utils/logger");
const { publishEvent } = require("../utils/rabbitmq");
const { validateCreatePost } = require("../utils/validation");

async function invalidatePostCache(req, input) {
  const cachedkey = `post:${input}`;
  await req.redisClient.del(cachedkey);
  const keys = req.redisClient.keys("posts:");

  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}

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

    await invalidatePostCache(req, newlyCreatedPost._id.toString());

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

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const cacheKey = `post:${postId}`;

    const cachedPost = await req.redisClient.get(cacheKey);

    if (cachedPost) {
      return res.json(JSON.parse(cachedPost));
    }

    const postDetailbyId = await Post.findById(postId);

    if (!postDetailbyId) {
      return res.status(404).json({
        success: false,
        message: "post not found",
      });
    }

    await req.redisClient.setex(
      cachedPost,
      3600,
      JSON.stringify(postDetailbyId)
    );
    res.json(postDetailbyId);
  } catch (error) {
    logger.error("Error fetching post");
    res.status(500).json({
      success: false,
      message: "Error fetching post",
    });
  }
};

const Deletepost = async (req, res) => {
  logger.info("Delete post endpoint...");
  try {
    const postId = req.params.id;
    const user = req.user.userId;

    const post = await Post.findByIdAndDelete({ _id: postId, user });

    if (!post) {
      logger.warn("Error by Deleting post");
      res.status(404).json({
        message: "Error by deleting post",
        success: false,
      });
    }

    //publish post delete method
    await publishEvent("post.deleted", {
      postId: post._id.toString(),
      userId: req.user.userId,
      mediaIds: post.mediaIds,
    });

    await invalidatePostCache(req, postId);
    res.json({ message: "post Deleted successfully", success: true });
  } catch (error) {
    logger.error("Error Deleting posts");
    res.status(500).json({
      success: false,
      message: "Error Deleting posts",
    });
  }
};

module.exports = { getAllposts, Deletepost, createPost, getPost };
