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

router.get("/", auth, restrictTo("user"), getUsers);
router.get("/me", auth, restrictTo("user"), getLoggedInUser);
router.post("/signup", signup);
router.post("/login", login);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);

module.exports = router;
