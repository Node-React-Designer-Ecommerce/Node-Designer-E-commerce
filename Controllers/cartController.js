const User = require('../Models/userModel');
const Product = require('../Models/productModel');

// Add an item to the user's cart
exports.addToCart = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({
            status: 'error',
            message: 'User not found'
        });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).send({
            status: 'error',
            message: 'Product not found'
        });
    }

    // Calculate the price
    const price = product.price * quantity;

    // Add the item to the cart
    user.cart.push({
        product: product._id,
        quantity,
        price,
    });

    await user.save();
    res.status(200).send({
        status: 'success',
        message: 'Item added to cart successfully',
        data: user.cart
    });
};

// Get all items in the user's cart
exports.getCart = async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('cart.product');
    if (!user) {
        return res.status(404).send({
            status: 'error',
            message: 'User not found'
        });
    }

    res.status(200).send({
        status: 'success',
        message: 'Cart retrieved successfully',
        data: { data: user.cart },
    });
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
    const { userId, cartItemId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send({
            status: 'error',
            message: 'User not found'
        });
    }

    // Remove the item from the cart
    user.cart = user.cart.filter(item => item._id.toString() !== cartItemId);

    await user.save();
    res.status(200).send({
        status: 'success',
        message: 'Item removed from cart successfully',
        data: user.cart
    });
};
