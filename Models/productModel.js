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
    size: {
      type: String,
      enum: ["3XL", "2XL", "XL", "L", "M"],
    },
    quantity: {
      type: Number,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
