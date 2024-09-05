const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
require("express-async-errors");

// Custom Error Class
const AppError = require("./utils/AppError");
const logger = require("./utils/logger");

// Define Express app
const app = express();

// Load environment variables
dotenv.config();

// Use middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static("./public"));

// Use Routes

// ---------------------
app.use("/", (req, res) => {
  res.send({ message: "Welcome To the Server" });
});

// Not Found Routes
app.all("/*", (req, res, next) => {
  throw new AppError(
    `Error : Can't find ${req.originalUrl} on this server!`,
    404
  );
});

// Global Error Middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Connect to MongoDB

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    logger.info("Connected to MongoDB Server");
    app.listen(process.env.PORT, () => {
      logger.info(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to connect to MongoDB", err);
  });
