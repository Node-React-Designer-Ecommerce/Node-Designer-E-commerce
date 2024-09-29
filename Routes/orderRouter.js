const { Router } = require("express");
const { auth } = require("./../Middlewares/authMiddleware");
const orderController = require("./../Controllers/orderController");
const router = Router();

router.post("/", auth, orderController.createOrder);

router.post("/kashier", orderController.webhook);

module.exports = router;
