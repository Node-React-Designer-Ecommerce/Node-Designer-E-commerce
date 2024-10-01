const { Router } = require("express");
const { auth, restrictTo } = require("../Middlewares/authMiddleware");
const {
  toggleFavoriteProduct,
  getFavoriteProducts,
} = require("../Controllers/favProductsController");
const router = Router();

router.post("/:id", auth, restrictTo("user"), toggleFavoriteProduct);
router.get("/", auth, restrictTo("user"), getFavoriteProducts);

module.exports = router;
