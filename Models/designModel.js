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
    // canvas: {
    //   type: String,
    // },

    canvases: {
      front: { type: String },
      back: { type: String },
    },
    totalPrice: Number,
    isGamed: {
      type: Boolean,
    },
    image: {
      type: [String], // Update to an array of strings
    },
    //image: {
    //  type: String,
    // },
    dragImages: [String],
  },
  {
    timestamps: true,
  }
);

const Design = mongoose.model("Design", designSchema);

module.exports = Design;
