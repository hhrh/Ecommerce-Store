const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    images: [
        {
        secure_url: String,
        public_id: String,
        },
    ],
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    avgReview: Number,
}, {timestamps: true})

module.exports = mongoose.model('Product', ProductSchema)