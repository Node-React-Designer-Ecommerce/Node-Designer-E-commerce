const mongoose = require("mongoose");
const crypto = require("crypto");
const CartItem = require("./CartItem");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: String,
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordConfirm: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    cart: [CartItem.schema],
  },
  {
    timestamps: true,
  }
);
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
