const { Router } = require("express");
const {
  getAllDesigns,
  createDesign,
  getDesignById,
  updateDesign,
  deleteDesign,
} = require("../Controllers/designController");
const { restrictTo, auth } = require("../Middlewares/authMiddleware");

const router = Router();
router.get("/", getAllDesigns);
router.get("/:id", getDesignById);
router.post("/", auth, restrictTo("user"), createDesign);
router.patch("/:id", auth, restrictTo("user"), updateDesign);
router.delete("/:id", auth, restrictTo("user"), deleteDesign);

module.exports = router;
