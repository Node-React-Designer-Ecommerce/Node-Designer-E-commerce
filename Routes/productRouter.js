const { Router } = require("express");
const {
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  addNewProduct,
  getDesignableProducts,
  getDesignableProductById,
} = require("../Controllers/productController");
const { restrictTo, auth } = require("../Middlewares/authMiddleware");
const { uploadImages, handleImages } = require("../Middlewares/images");
const router = Router();
router.get("/", getAllProduct);
router.get("/designable-products", getDesignableProducts);
router.get("/designable-products/:id", getDesignableProductById);
router.get("/:id", getProductById);
router.post(
  "/",
  auth,
  restrictTo("admin"),
  uploadImages([{ name: "image", count: 1 }]),
  handleImages("image"),
  addNewProduct
);
router.patch("/:id", auth, restrictTo("admin"), updateProduct);
router.delete("/:id", auth, restrictTo("admin"), deleteProduct);

module.exports = router;
