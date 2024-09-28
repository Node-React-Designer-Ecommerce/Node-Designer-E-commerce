const express = require("express");
const router = express.Router();
const cartController = require("../Controllers/cartController");
const { auth, restrictTo } = require("../Middlewares/authMiddleware");

router.use(auth, restrictTo("user"));

router.post("/", cartController.addToCart);

router.get("/", cartController.getCart);

router.delete("/:cartItemId", cartController.removeFromCart);

router.patch("/:cartItemId", cartController.updateCartItem);

router.post("/set", cartController.setCart);

router.delete("/", cartController.clearCart);

module.exports = router;
