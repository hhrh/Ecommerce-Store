const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    productId: String,
    userId: String,
    userName: String,
    reviewMessage: String,
    reviewValue: Number,
    country: String,
    state: String,
}, {timestamps: true})

module.exports = mongoose.model("Review", ReviewSchema);