const { Router } = require("express");
const { auth, restrictTo } = require("./../Middlewares/authMiddleware");
const orderController = require("./../Controllers/orderController");
const router = Router();

router.post("/", auth, orderController.createOrder);

router.post("/kashier", orderController.webhook);
router.get("/me", auth, restrictTo("user"), orderController.getUserOrders);
router.get("/", auth, restrictTo("admin"), orderController.getOrders);

module.exports = router;
