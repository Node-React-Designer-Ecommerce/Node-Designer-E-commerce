const Product = require("../Models/productModel");
const User = require("../Models/userModel");
const AppError = require("../Utils/AppError");

// 1- add fav
exports.toggleFavoriteProduct = async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("product not found", 404);
  }

  const user = await User.findById(userId);

  // Check if the product is already in the user's favProducts array
  const isAlreadyFav = user.favProducts.includes(productId);

  if (isAlreadyFav) {
    // Remove it from favProducts and set isFav to false
    user.favProducts = user.favProducts.filter(
      (favProductId) => favProductId.toString() !== productId.toString()
    );
    product.isFav = false;
  } else {
    // Add it to favProducts and set isFav to true
    user.favProducts.push(productId);
    product.isFav = true;
  }

  await user.save();
  await product.save();

  res.status(200).send({
    status: "success",
    message: isAlreadyFav
      ? "Product removed from favorites"
      : "Product added to favorites",
    data: { product },
  });
};

// 2- get all favorite product
exports.getFavoriteProducts = async (req, res, next) => {
  const userId = req.user._id;

  // Find the user and populate the favorite products
  const user = await User.findById(userId).populate({
    path: "favProducts",
    select: "name price description stock category image isDesignable isFav",
  });

  res.status(200).send({
    status: "success",
    message: "Favorite products retrieved successfully",
    data: {
      favProducts: user.favProducts,
    },
  });
};
