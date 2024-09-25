const { Router } = require("express");
const paymentController = require("../Controllers/paymentController");
const { restrictTo, auth } = require("../Middlewares/authMiddleware");
const router = Router();

router.post("/", auth, paymentController.createPayment); // Create payment
router.get("/", auth, restrictTo("admin"), paymentController.getAllPayments); // Fetch all payments (admin)
router.get("/:id", auth, restrictTo("admin"), paymentController.getPaymentById); // Fetch payment by ID
router.put("/:id", auth, paymentController.updatePayment); // Update payment status or transaction ID

module.exports = router;
