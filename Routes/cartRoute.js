const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cartController');

router.post('/users/:userId/cart', cartController.addToCart);


router.get('/users/:userId/cart', cartController.getCart);


router.delete('/users/:userId/cart/:cartItemId', cartController.removeFromCart);

module.exports = router;