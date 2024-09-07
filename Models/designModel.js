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
    color: {
      type: String,
    },
    isGamed: {
      type: Boolean,
    },
    totalPrice: {
      type: Number,
    },
    layers: [
      {
        name: {
          type: String,
        },
        visiable: {
          type: Boolean,
          default: true,
        },
        locked: {
          type: Boolean,
          default: false,
        },
        price: {
          type: Number,
        },
        element: {
          type: {
            type: String,
            enum: ["image", "text"],
          },
          content: {
            type: String,
          },
          position: {
            x: { type: Number },
            y: { type: Number },
          },
          size: {
            width: { type: Number },
            height: { type: Number },
          },
          rotation: { type: Number, default: 0 },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Design = mongoose.model("Desgin", designSchema);

module.exports = Design;
