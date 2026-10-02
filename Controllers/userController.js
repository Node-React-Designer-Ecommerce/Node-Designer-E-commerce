const AppError = require("../Utils/AppError");
const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Email = require("../Utils/email");
const crypto = require("crypto");
const {
  signupSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordSchema,
} = require("./../Validations/usersSchemas");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    data: { token, role: user.role, user },
  });
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    throw new AppError("No users found", 404);
  }
  res.status(200).send({
    status: "success",
    message: "Users Retreived Successfully",
    data: { users },
  });
};

exports.getUserById = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("No user found with that ID", 404);
  }
  res.status(200).send({
    status: "success",
    message: "User Retreived Successfully",
    data: { user },
  });
};

exports.signup = async (req, res, next) => {
  const { error } = signupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(errorMessages, 400));
  }
  const { name, email, address, phone, password, passwordConfirm } = req.body;
  //check if password matches passwordConfirm
  if (passwordConfirm !== password) {
    throw new AppError("Passwords do not match", 400);
  }
  //hash the password

  //see if the user exists or not
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    throw new AppError("email is already used", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  //create new user
  const newUser = await User.create({
    name,
    email,
    role: "user",
    address,
    phone,
    password: hashedPassword,
    passwordConfirm: undefined,
  });
  newUser.password = undefined;

  // const url = `${req.protocol}://${req.get("host")}/me`;
  // await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res, "User Created Successfully");
};

exports.deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError("No user found with that ID", 404);
  }
  res.status(204).send({
    status: "success",
    message: "User Deleted Successfully",
  });
};

exports.updateUser = async (req, res, next) => {
  const userId = req.params.id;
  const { name, address, phone } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, address, phone },
    {
      new: true,
    },
  );
  if (!updatedUser) {
    throw new AppError("No user found with that ID", 404);
  }
  res.status(200).send({
    status: "success",
    message: "User Updated Successfully",
    data: { updatedUser },
  });
};

exports.login = async (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(errorMessages, 400));
  }
  const { email, password } = req.body;
  //check if email exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("email or password is Invalid", 400);
  }
  //check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("email or password is Invalid", 400);
  }

  createSendToken(user, 200, res, "Login Successful");
};

exports.getLoggedInUser = async (req, res) => {
  res.status(200).send({
    status: "success",
    message: "User Retreived Successfully",
    data: { user: req.user },
  });
};

exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new AppError("there is no user with this email address", 404);
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
  await new Email(user, resetURL).sendPasswordreset();

  res.status(200).send({
    status: "success",
    message: "Token sent to email!",
  });
};

exports.resetPassword = async (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(errorMessages, 400));
  }
  // 1) Check if passwords match
  if (req.body.password !== req.body.passwordConfirm) {
    throw new AppError("Passwords do not match", 400);
  }
  // 2) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 3) If token has not expired , and there is user , set the new password
  if (!user) {
    throw new AppError("Token invalid or has expired", 400);
  }
  // 4) update changedPassswordAt property for the user
  const hashedPassword = await bcrypt.hash(req.body.password, 8);

  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
  });
};

// ----------------update password ------------------------------
exports.updatePassword = async (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(errorMessages, 400));
  }
  const { password, passwordConfirm, oldPassword } = req.body;

  if (password !== passwordConfirm) {
    throw new AppError("Passwords do not match", 400);
  }

  const user = await User.findById(req.user._id).select("+password");

  const matched = await bcrypt.compare(oldPassword, user.password);
  if (!matched) {
    throw new AppError("your current password is wrong.", 401);
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};