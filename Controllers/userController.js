const AppError = require("../Utils/AppError");
const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const Email = require("../Utils/email");
const crypto = require("crypto");

// Joi schema for user signup
const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  address: Joi.string().min(3).max(100).required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/)

    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number.",
    }),
  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});

// Joi schema for login validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,20}$/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.empty": "Password is required",
    }),
});

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
  // Validate request body with Joi
  const { error } = signupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(", ");
    return next(new AppError(errorMessages, 400));
  }
  const { name, email, address, password, passwordConfirm } = req.body;
  //check if password matches passwordConfirm
  if (passwordConfirm !== password) {
    throw new AppError("Passwords do not match", 400);
  }
  //hash the password
  const hashedPassword = await bcrypt.hash(password, 8);

  //see if the user exists or not
  const existEmail = await User.findOne({ email });
  if (existEmail)
    return res
      .status(409)
      .send({ status: "fail", message: "email is already used" });

  //create new user
  const newUser = await User.create({
    name,
    email,
    role: "user",
    address,
    password: hashedPassword,
    passwordConfirm: undefined,
  });
  newUser.password = undefined;

  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(newUser, url).sendWelcome();

  res.status(201).send({
    status: "success",
    message: "User Created Successfully",
    data: { user: newUser },
  });
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
  const { name, email, address } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, email, address },
    {
      new: true,
    }
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

  //generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
  res.status(200).send({
    status: "success",
    message: "Login Successful",
    data: { token, role: user.role },
  });
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
  //TODO add validation

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
  //add validaion
  const { password, passwordConfirm, oldPassword } = req.body;

  if (password !== passwordConfirm) {
    throw new AppError("Passwords do not match", 400);
  }
  console.log(req.user._id);

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
