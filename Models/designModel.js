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
  },
  {
    timestamps: true,
  }
);

const Design = mongoose.model("Desgin", designSchema);

module.exports = Design;
