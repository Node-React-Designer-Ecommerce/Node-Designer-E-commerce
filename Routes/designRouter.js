const { Router } = require("express");
const {
  getAllDesigns,
  createDesign,
  getDesignById,
  updateDesign,
  deleteDesign,
} = require("../Controllers/designController");
const { restrictTo, auth } = require("../Middlewares/authMiddleware");
const { uploadImages, handleImages } = require("../Middlewares/images");

const router = Router();
router.get("/", getAllDesigns);
router.get("/:id", getDesignById);
router.post(
  "/",
  auth,
  restrictTo("user"),
  uploadImages([{ name: "image", count: 1 }]),
  handleImages("image"),
  createDesign
);
router.patch("/:id", auth, restrictTo("user"), updateDesign);
router.delete("/:id", auth, restrictTo("user"), deleteDesign);

module.exports = router;
