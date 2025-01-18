const express = require('express');

const {addToCart, fetchCartItems, updateCartItemQty, deleteCartItem, mergeCarts} = require('../../controllers/shop/cart-controller');

const router = express.Router();

router.post('/add', addToCart);
router.get('/get/:userId', fetchCartItems);
router.put('/update-cart', updateCartItemQty);
router.delete('/:userId/:productId', deleteCartItem);
router.post('/merge/', mergeCarts);

module.exports = router;