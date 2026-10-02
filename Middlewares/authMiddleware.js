const jwt = require("jsonwebtoken");
const User = require("./../Models/userModel");
const AppError = require("../Utils/AppError");
exports.auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    throw new AppError("Please log in to get access", 401);
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired token, please log in again", 401);
  }

  const user = await User.findById(payload.id);

  if (!user) {
    throw new AppError(
      "The user belonging to this token no longer exists",
      401,
    );
  }
  req.user = user;
  next();
};

exports.restrictTo = (role) => {
  // role === admin
  return (req, res, next) => {
    if (role !== req.user?.role) {
      throw new AppError("You are not Authorized", 401);
    }
    next();
  };
};
