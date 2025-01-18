const Order = require('../../models/Order');
const Product = require('../../models/Product');
const Review = require('../../models/Review');

const addProductReview = async(req,res)=>{
    console.log("wierd");
    try {
        const {
            productId,
            userId,
            userName,
            reviewMessage,
            reviewValue,
            country,
            state,
        } = req.body;

        //check if user ordered this product and it confirmed it.
        const order = await Order.findOne({
            userId,
            "cartItems.productId": productId,
            paymentStatus: "Paid",
        });
        if (!order) {
            return res.status(403).json({
                success: false,
                message: "You need to purchase this product before reviewing.",
            });
        }

        //a user shouldnt be able to add more than one review
        const hasReviewed = await Review.findOne({ productId, userId });
        if (hasReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted a review for this item.",
            });
        }

        const newReview = new Review({
            productId,
            userId,
            userName,
            reviewMessage,
            reviewValue,
            country,
            state,
        });

        await newReview.save();

        const reviews = await Review.find({ productId });

        const avgReview = //calculate average 5star review
            reviews.length > 0
                ? reviews.reduce(
                      (sum, reviewItem) => sum + reviewItem.reviewValue,
                      0
                  ) / reviews.length
                : 0; // Default to 0 if no reviews

        await Product.findByIdAndUpdate(
            productId,
            { $set: { avgReview } },
            { runValidators: true }
        );

        res.status(201).json({
            success: true,
            data: newReview,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error adding product review'
        })
    }
}

const getProductReviews = async (req, res) => {
    try {
        const {productId} = req.params;

        const reviews = await Review.find({productId});
        res.status(200).json({
            success: true,
            data: reviews,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error getting product reviews",
        });
    }
};

module.exports = {addProductReview, getProductReviews}