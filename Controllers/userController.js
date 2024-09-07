const AppError = require("../Utils/AppError");
const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
  //lesa fe validation
  const { name, email, address, password, passwordConfirm } = req.body;
  //check if password matches passwordConfirm
  if (passwordConfirm !== password) {
    throw new AppError("Passwords do not match", 400);
  }
  //hash the password
  const hashedPassword = await bcrypt.hash(password, 8);
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
