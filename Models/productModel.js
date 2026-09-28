const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    stock: [
      {
        quantity: Number,
        size: String,
      },
    ],
    image: {
      type: String,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    backImage: {
      type: String,
    },
    extraImages: [{ type: String }],

    isDesignable: {
      type: Boolean,
    },
    canvasWidth: {
      type: Number,
      default: 400,
    },
    canvasHeight: {
      type: Number,
      default: 500,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    inactive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
