const { Router } = require("express");
const {
  getAllDesigns,
  createDesign,
  getDesignById,
  updateDesign,
  deleteDesign,
  getUserDesigns,
} = require("../Controllers/designController");
const { restrictTo, auth } = require("../Middlewares/authMiddleware");
const { uploadImages, handleImages } = require("../Middlewares/images");

const router = Router();
router.get("/", getAllDesigns);

router.post(
  "/",
  auth,
  restrictTo("user"),
  uploadImages([
    { name: "image", count: 1 },
    { name: "dragImages", count: 5 },
  ]),

  handleImages("image"),
  handleImages("dragImages"),
  createDesign
);

router.get("/me", auth, restrictTo("user"), getUserDesigns);
router.get("/:id", getDesignById);
router.patch("/:id", auth, restrictTo("user"), updateDesign);
router.delete("/:id", auth, restrictTo("user"), deleteDesign);

module.exports = router;
