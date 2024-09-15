const { Router } = require("express");
const {
  getUsers,
  getUserById,
  signup,
  deleteUser,
  updateUser,
  login,
  getLoggedInUser,
} = require("./../Controllers/userController");
const { restrictTo, auth } = require("../Middlewares/authMiddleware");

const router = Router();

router.get("/", auth, restrictTo("admin"), getUsers);
router.get("/me", auth, restrictTo("user"), getLoggedInUser);
router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", auth, getUserById);
router.delete("/:id", auth, restrictTo("admin"), deleteUser);
router.patch("/:id", auth, restrictTo("user"), updateUser);

module.exports = router;
