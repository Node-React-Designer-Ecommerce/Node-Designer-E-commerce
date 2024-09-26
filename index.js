const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("express-async-errors");

// Routers Imports
const userRouter = require("./Routes/userRouter");
const designRouter = require("./Routes/designRouter");
const productRouter = require("./Routes/productRouter");
const categoryRouter = require("./Routes/categoryRouter");
const cartRouter = require("./Routes/cartRoute");
// Custom Error Class
const AppError = require("./Utils/AppError");
// Logger
const logger = require("./Utils/logger");

// Global Error Middleware import
const globalErrorMiddleware = require("./Middlewares/globalErrorMiddleware");

// Define Express app
const app = express();

// Use middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Use Routes
// ---------------------
app.use("/api/v1/users", userRouter);
app.use("/api/v1/designs", designRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/user", cartRouter);

// Welcome Route
app.get("/", (req, res) => {
  res.send({ message: "Welcome to the Express app!" });
});

// Not Found Routes
app.all("/*", (req, res, next) => {
  throw new AppError(
    `Error : Can't find ${req.originalUrl} on this server!`,
    404
  );
});

// Global Error Middleware
app.use(globalErrorMiddleware);

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
