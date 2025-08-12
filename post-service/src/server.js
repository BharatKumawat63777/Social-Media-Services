require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const cors = require("cors");
const helmet = require("helmet");
const postRoute = require("./routes/post-route");
const errorHandler = require("./middleware/errorHanddler");

const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 3002;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("connect to mongoDb"))
  .catch(() => logger.error("Mongo Connection error", e));

const redisClient = new Redis(process.env.REDIS_URL);
//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body ${req.body}`);
  next();
});

//*** diff rate limiter */

app.use(
  "/api/posts",
  (req, res) => {
    req.redisClient = redisClient;
    next();
  },
  postRoute
);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Identity service running on port ${PORT}`);
});

process.on("unhandlerRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason", reason);
});
