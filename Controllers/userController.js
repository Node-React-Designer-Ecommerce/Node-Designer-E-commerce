const AppError = require("../Utils/AppError");
const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

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
