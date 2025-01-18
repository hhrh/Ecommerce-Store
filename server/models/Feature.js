const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
    url: String,
    publicId: String
}, {timestamps: true})

module.exports = mongoose.model('Feature', FeatureSchema);