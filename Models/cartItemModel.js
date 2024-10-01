const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  design: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Design",
  },
  type: {
    type: String,
    enum: ["Product", "Design"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    // required: true,
  },
  size: {
    type: String,
    required: true,
  },
});
const CartItem = mongoose.model("Cart", cartItemSchema);
module.exports = CartItem;
