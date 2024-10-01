const Product = require("../Models/productModel");
const Design = require("./../Models/designModel");
const AppError = require("../Utils/AppError");

// Add an item to the user's cart
exports.addToCart = async (req, res) => {
  let { productId, quantity, size, type, designId } = req.body;

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
  let design;
  if (type === "Design") {
    design = await Design.findById(designId);
    if (!design) {
      throw new AppError("Design not found", 404);
    }
    console.log(design);

    productId = design.productId;
  }

  const product = await Product.findById(productId);

  // Find the product
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  // Check if the product already exists in the cart
  let existingCartItem;

  if (type === "Product") {
    existingCartItem = cart.find(
      (item) => item?.product?.toString() === productId && item.size === size
    );
  } else if (type === "Design") {
    existingCartItem = cart.find(
      (item) => item?.design?.toString() === designId && item.size === size
    );
  }

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
  let price;
  if (type === "Product") {
    price = product.price * quantity;
  } else if (type === "Design") {
    price = design.totalPrice * quantity;
  }

  // Add the item to the cart
  cart.push({
    product: productId,
    design: designId,
    type,
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
  // await req.user.populate({
  //   path: "cart.product",
  //   model: "Product",
  //   select: "name image price stock", // Include only necessary fields
  // });

  await req.user.populate({
    path: "cart.product",
    model: "Product",
    select: "name image price stock", // Only include necessary fields
  });

  // Populate the design details in the cart (if present)
  await req.user.populate({
    path: "cart.design",
    model: "Design",
    // select: "image price", // Specify fields for Design if needed
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
  if (cartItem.type === "Product") {
    cartItem.price = product.price * quantity;
  } else if (cartItem.type === "Design") {
    const design = await Design.findById(cartItem.design);
    if (!design) {
      throw new AppError("Design not found", 404);
    }
    cartItem.price = design.totalPrice * quantity;
  }
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

// exports.setCart = async (req, res, next) => {
//   const { cart } = req.body;

//   const user = req.user;

//   if (!user) {
//     throw new AppError("user not found", 404);
//   }

//   user.cart = cart.map((prod) => ({ ...prod }));

//   await user.save();

//   res.status(200).send({
//     status: "success",
//     message: "cart merged successfully",
//     data: { cart: user.cart },
//   });
// };

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
