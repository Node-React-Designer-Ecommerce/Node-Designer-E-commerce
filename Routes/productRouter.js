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
  uploadImages([
    { name: "image", count: 1 },
    { name: "backImage", count: 1 },
    { name: "extraImages", count: 4 },
  ]),
  handleImages("image"),
  handleImages("backImage"),
  handleImages("extraImages"),
  addNewProduct,
);
router.patch(
  "/:id",
  auth,
  restrictTo("admin"),
  uploadImages([
    { name: "image", count: 1 },
    { name: "backImage", count: 1 },
    { name: "extraImages", count: 4 },
  ]),
  handleImages("image"),
  handleImages("backImage"),
  handleImages("extraImages"),
  updateProduct,
);
router.delete("/:id", auth, restrictTo("admin"), deleteProduct);

module.exports = router;
