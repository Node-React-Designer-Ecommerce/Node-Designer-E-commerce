const { Router } = require("express");
const { auth } = require("./../Middlewares/authMiddleware");
const orderController = require("./../Controllers/orderController");
const router = Router();

router.use(auth);

router.post("/", orderController.createOrder);

module.exports = router;
