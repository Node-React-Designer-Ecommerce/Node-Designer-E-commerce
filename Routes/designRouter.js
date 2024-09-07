const { Router } = require("express");
const { getAllDesigns, createDesign, getDesignById, updateDesign, deleteDesign } = require("../Controllers/designController");
const { auth } = require("../Middlewares/authMiddleware");







const router = Router();
router.get('/' ,getAllDesigns);
router.get('/:id',getDesignById);
router.post('/',createDesign);
router.patch('/:id',updateDesign);
router.delete('/:id',deleteDesign);

module.exports = router;
