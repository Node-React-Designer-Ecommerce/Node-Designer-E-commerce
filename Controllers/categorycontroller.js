const AppError = require("../Utils/AppError");
const Category = require("../Models/categoryModel");
const categorySchema = require("../Validations/categoriesSchemas");


///1- Get all Categories ///

exports.getAllCategories = async (req, res, next) => {
  const categories = await Category.find();
  if (!categories) throw new AppError("No Categories Found", 404);
  res.status(200).send({
    status: "success",
    message: "Categories retrieved successfully",
    data: { categories },
  });
};

///2- Get Category By Id ///

exports.getCategoryById = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await Category.findById(categoryId);
  if (!category) throw new AppError("No category found with this id ", 404);
  res.status(200).send({
    status: "success",
    message: "Category retrieved successfully",
    data: { category },
  });
};

///3- Add Category ///

exports.addCategory = async (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message,
    });
  }
  let image;
  if (req.body.image) image = req.body.image[0];
  const newCategory = await Category.create({ ...req.body, image });
  if (!newCategory) throw new AppError("Error adding category", 400);
  res.status(201).send({
    status: "success",
    message: "Category added successfully",
    data: { newCategory },
  });
};

///04- update category ///

exports.updateCategroy = async (req, res, next) => {
  let image;
  if (req.body.image) image = req.body.image[0];
  const categoryId = req.params.id;
  const category = await Category.findByIdAndUpdate(
    { _id: categoryId },
    { ...req.body, image },
    { new: true, runValidators: true }
  );
  if (!category) throw new AppError("Category not found", 404);
  res.status(200).send({
    status: "success",
    message: "Category updated successfully",
    data: { category },
  });
};

///05- delete category ///

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) throw new AppError("Category not found", 404);
  res.status(204).send({
    status: "success",
    message: "Category deleted successfully",
  });
};
