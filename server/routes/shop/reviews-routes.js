const express = require('express');
const { addProductReview, getProductReviews} = require('../../controllers/shop/reviews-controller')

const router = express.Router();

router.post('/add', addProductReview);
router.get('/:productId', getProductReviews);

module.exports = router;
