const mongoose = require("mongoose");

const designSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    userId: {
      //option
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    canvas: {
      type: String,
    },
    totalPrice: Number,
    isGamed: {
      type: Boolean,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Design = mongoose.model("Design", designSchema);

module.exports = Design;
