const mongoose = require('mongoose')
const OrderSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    cartItems: [
        {
            productId: String,
            title: String,
            image: String,
            price: String,
            quantity: Number,
        },
    ],
    addressInfo: {
        firstName: String,
        lastName: String,
        address: String,
        aptSuite: String,
        city: String,
        state: String,
        country: String,
        zipcode: String,
        phone: String,
        notes: String,
    },
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    totalAmount: Number,
    orderDate: Date,
    orderUpdateDate: Date,
    paymentId: String,
    payerId: String,
    cartId: String,
});
module.exports = mongoose.model("Order", OrderSchema)