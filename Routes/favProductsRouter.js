const { Router } = require("express");
const { auth, restrictTo } = require("../Middlewares/authMiddleware");
const {
  toggleFavoriteProduct,
  getFavoriteProducts,
} = require("../Controllers/favProductsController");
const router = Router();

router.patch(
  "/products/:productId/fav",
  auth,
  restrictTo("user"),
  toggleFavoriteProduct
);
router.get("/favProducts", auth, restrictTo("user"), getFavoriteProducts);

module.exports = router;