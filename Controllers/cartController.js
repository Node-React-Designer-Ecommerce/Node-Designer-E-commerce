const Product = require("../Models/productModel");
const AppError = require("../Utils/AppError");

// Add an item to the user's cart
exports.addToCart = async (req, res) => {
  const { productId, quantity, size } = req.body;

  if (!req.user) {
    throw new AppError("User not found", 404);
  }
  const cart = req.user.cart;

  if (quantity < 1) {
    return res.status(200).send({
      status: "Not-Modified",
      message: "Item Quantity must be 1 or greater",
      data: { cart },
    });
  }

  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if the product already exists in the cart
  const existingCartItem = cart.find(
    (item) => item.product.toString() === productId && item.size === size
  );
  if (existingCartItem) {
    return res.status(200).send({
      status: "Not-Modified",
      message: "Item Alread in cart",
      data: { cart },
    });
  }

  // Check if the product size is available
  const productStock = product.stock.find((el) => el.size === size);
  if (!productStock) {
    // throw new AppError("Product size is not available", 400);
    return res.status(200).send({
      status: "Not-Modified",
      message: "Product size is not available",
      data: { cart },
    });
  }
  if (productStock.quantity < quantity) {
    // throw new AppError("this quantity is not in stock", 400);
    return res.status(200).send({
      status: "Not-Modified",
      message: "this quantity is not in stock",
      data: { cart },
    });
  }

  // Calculate the price
  const price = product.price * quantity;

  // Add the item to the cart
  cart.push({
    product: product._id,
    quantity,
    price,
    size,
  });

  await req.user.save();
  res.status(200).send({
    status: "success",
    message: "Item added to cart successfully",
    data: { cart },
  });
};

// Get all items in the user's cart
exports.getCart = async (req, res) => {
  if (!req.user) {
    throw new AppError("User not found", 404);
  }

  // Populate the product details in the cart
  await req.user.populate({
    path: "cart.product",
    model: "Product",
    select: "name image price stock", // Include only necessary fields
  });

  const cart = req.user.cart;
  res.status(200).send({
    status: "success",
    message: "Cart retrieved successfully",
    data: { cart },
  });
};

// Update an item in the user's cart
exports.updateCartItem = async (req, res, next) => {
  const { quantity } = req.body;
  const { cartItemId } = req.params;

  const user = req.user;
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (quantity < 1) {
    return res.status(200).send({
      status: "Not-Modified",
      message: "Item Quantity must be 1 or greater",
      data: { cart: user.cart },
    });
  }

  const cartItem = user.cart.find(
    (item) => item._id && item._id.toString() === cartItemId
  );

  if (!cartItem) {
    throw new AppError("Product not found in cart", 404);
  }
  // Check if the product size is available
  const product = await Product.findById(cartItem.product);
  // console.log(product);

  if (!product) {
    throw new AppError("Product not found", 404);
  }
  const productStock = product.stock.find((el) => el.size === cartItem.size);
  if (!productStock) {
    return res.status(200).send({
      status: "Not-Modified",
      message: "Product size is not available",
      data: { cart: user.cart },
    });
  }
  if (productStock.quantity < quantity) {
    // throw new AppError("This quantity is not in stock", 400);
    return res.status(200).send({
      status: "Not-Modified",
      message: "This quantity is not in stock",
      data: { cart: user.cart },
    });
  }
  // Update the quantity
  cartItem.price = product.price * quantity;
  cartItem.quantity = quantity;
  await user.save();

  res.status(200).send({
    status: "success",
    message: "Cart Item updated successfully",
    data: {
      cart: user.cart,
    },
  });
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { cartItemId } = req.params;
  const user = req.user;
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const cartItem = user.cart.find((item) => item._id.toString() === cartItemId);
  if (!cartItem) {
    throw new AppError("Product not found in cart", 404);
  }

  // Remove the item from the cart
  user.cart = user.cart.filter((item) => item._id.toString() !== cartItemId);

  await user.save();
  res.status(200).send({
    status: "success",
    message: "Item removed from cart successfully",
    data: { cart: user.cart },
  });
};

exports.setCart = async (req, res, next) => {
  const { cart } = req.body;

  const user = req.user;

  if (!user) {
    throw new AppError("user not found", 404);
  }

  user.cart = cart.map((prod) => ({ ...prod }));

  await user.save();

  res.status(200).send({
    status: "success",
    message: "cart merged successfully",
    data: { cart: user.cart },
  });
};

exports.clearCart = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    throw new AppError("User not found", 404);
  }
  user.cart = [];
  await user.save();
  res.status(200).send({
    status: "success",
    message: "Cart cleared successfully",
    data: { cart: user.cart },
  });
};
