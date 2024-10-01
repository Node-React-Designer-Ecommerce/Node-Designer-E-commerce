const Product = require("../Models/productModel");
const User = require("../Models/userModel");
const AppError = require("../Utils/AppError");

// 1- add fav
exports.toggleFavoriteProduct = async (req, res, next) => {
  const user = req.user;
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("product not found", 404);
  }

  // Check if the product is already in the user's favProducts array
  const isAlreadyFav = user.favProducts.includes(id);

  if (isAlreadyFav) {
    //   // Remove it from favProducts and set isFav to false
    user.favProducts = user.favProducts.filter(
      (favProductId) => favProductId.toString() !== id.toString()
    );
    //   // product.isFav = false;
  } else {
    // Add it to favProducts and set isFav to true
    user.favProducts.push(id);
    //product.isFav = true;
  }

  await user.save();
  //await product.save();

  res.status(200).send({
    status: "success",
    message: isAlreadyFav
      ? "Product removed from favorites"
      : "Product added to favorites",
    data: { favProducts: user.favProducts },
  });
};

// 2- get all favorite product
exports.getFavoriteProducts = async (req, res, next) => {
  const userId = req.user._id;

  // Find the user and populate the favorite products
  const user = await User.findById(userId).populate({
    path: "favProducts",
    select: "name price description stock category image isDesignable ",
  });

  res.status(200).send({
    status: "success",
    message: "Favorite products retrieved successfully",
    data: {
      favProducts: user.favProducts,
    },
  });
};
