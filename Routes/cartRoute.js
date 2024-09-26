const express = require("express");
const router = express.Router();
const cartController = require("../Controllers/cartController");
const { auth, restrictTo } = require("../Middlewares/authMiddleware");

router.post("/cart", auth, restrictTo("user"), cartController.addToCart);

router.get("/cart", auth, restrictTo("user"), cartController.getCart);

router.delete(
  "/cart/:cartItemId",
  auth,
  restrictTo("user"),
  cartController.removeFromCart
);

module.exports = router;
