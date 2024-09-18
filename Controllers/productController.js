const AppError = require("../Utils/AppError");
const Product = require("../Models/productModel");

// 1- get all products
exports.getAllProduct = async (req, res, next) => {
  const products = await Product.find();
  if (!products) {
    throw new AppError("No products found", 404);
  }
  res.status(200).send({
    status: "success",
    message: "Products Retreived Successfully",
    data: { products },
  });
};
// 2- get one product by id
exports.getProductById = async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError("No product found with this id ", 404);
  }
  res.status(200).send({
    status: "success",
    message: "Product Retreived Successfully",
    data: { product },
  });
};
// 3- add new product
exports.addNewProduct = async (req, res, next) => {
  let image;
  if (req.body.image) image = req.body.image[0];
  const product = await Product.create({ ...req.body, image });

  if (!product) {
    throw new AppError("Error adding product", 400);
  }
  res.status(201).send({
    status: "success",
    message: "product created successfully",
    data: {
      product,
    },
  });
};
// 4- update product by id
exports.updateProduct = async (req, res, next) => {
  const productId = req.params.id;

  const updateProduct = await Product.findByIdAndUpdate(
    { _id: productId },
    { ...req.body },
    { new: true, runValidators: true }
  );
  if (!updateProduct) {
    throw new AppError("No product found with that ID", 404);
  }
  res.status(200).send({
    status: "success",
    message: "product updated successfully",
    data: { updateProduct },
  });
};

// 5- delete product by id
exports.deleteProduct = async (req, res, next) => {
  await Product.deleteOne({ _id: req.params.id });
  res.status(204).send({
    status: "success",
    message: "product deleted successfully",
  });
};
