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
    isDesignable: {
      type: Boolean,
    },
    canvasWidth: Number,
    canvasHeight: Number,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
