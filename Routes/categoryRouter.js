const { Router } = require("express");
const { getAllCategories, addCategory, updateCategroy, deleteCategory, getCategoryById } = require("../Controllers/categorycontroller");
const { restrictTo, auth } = require("../Middlewares/authMiddleware");
const { uploadImages, handleImages } = require("../Middlewares/images");
const router = Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', uploadImages([{name: "image", count: 1}]), handleImages("image") ,auth , restrictTo("admin"), addCategory);
router.patch('/:id',  uploadImages([{name: "image", count: 1}]), handleImages("image") ,auth, restrictTo("admin"), updateCategroy);
router.delete('/:id', auth, restrictTo("admin"), deleteCategory);

module.exports = router;