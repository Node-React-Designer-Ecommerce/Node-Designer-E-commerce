const User = require("../Models/userModel");
const Product = require("../Models/productModel");
const AppError = require("../Utils/AppError");

// Add an item to the user's cart
exports.addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity, size } = req.body;

  // Find the user
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const cart = user.cart;
  // Check if the product already exists in the cart
  const existingCartItem = cart.find(
    (item) => item.product.toString() === productId
  );
  if (existingCartItem) {
    return res.send({
      status: "no-change",
      message: "Item Alraedy in cart",
      data: user.cart,
    });
  }
  // Calculate the price
  const price = product.price * quantity;

  // Add the item to the cart
  user.cart.push({
    product: product._id,
    quantity,
    price,
    size,
  });

  await user.save();
  res.status(200).send({
    status: "success",
    message: "Item added to cart successfully",
    data: user.cart,
  });
};

// Get all items in the user's cart
exports.getCart = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate("cart.product");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).send({
    status: "success",
    message: "Cart retrieved successfully",
    data: user.cart,
  });
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { cartItemId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Remove the item from the cart
  user.cart = user.cart.filter((item) => item._id.toString() !== cartItemId);

  await user.save();
  res.status(200).send({
    status: "success",
    message: "Item removed from cart successfully",
    data: user.cart,
  });
};
