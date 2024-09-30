const AppError = require("../Utils/AppError");
const Product = require("../Models/productModel");
const APIFeatures = require("../Utils/APIFeatures");

// 1- get all products
exports.getAllProduct = async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .paginate()
    .search();

  const products = await features.query; // Execute the query

  const page = req.query.page * 1 || 1; // Current page number, default is 1
  const limit = req.query.limit * 1 || 8; // Number of items per page, default is 8
  const totalProducts = await Product.countDocuments(); // Total number of products in the collection
  const totalPages = Math.ceil(totalProducts / limit); // Calculate total pages

  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;
  res.status(200).send({
    status: "success",
    message: "Products Retreived Successfully",
    data: {
      products,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        prevPage,
        nextPage,
      },
    },
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

// 6- designable product

exports.getDesignableProducts = async (req, res, next) => {
  const products = await Product.find({ isDesignable: true });
  if (!products) throw new AppError("No designable products found", 404);
  res.status(200).send({
    status: "success",
    message: "Designable products retrieved successfully",
    data: { products },
  });
};

// 7- designable product by id
exports.getDesignableProductById = async (req, res, next) => {
  const designableProductId = req.params.id;
  const designableProduct = await Product.findById(designableProductId);
  if (!designableProduct) {
    throw new AppError("No product found with this id ", 404);
  }
  res.status(200).send({
    status: "success",
    message: "Product Retreived Successfully",
    data: { designableProduct },
  });
};
