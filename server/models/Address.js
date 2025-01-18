const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    userId: String,
    firstName: String,
    lastName: String,
    address: String,
    aptSuite: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
    phone: String,
    notes: String
}, {timestamps: true})

module.exports = mongoose.model("Address", AddressSchema);