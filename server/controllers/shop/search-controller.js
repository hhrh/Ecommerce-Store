const Product = require("../../models/Product");

const productSearch = async (req, res) => {
    try {
        const {keyword} = req.params;
        if(!keyword || typeof keyword != 'string') {
            return res.status(400).json({
                success: false,
                message: 'keyword is required and must be a string'
            })
        }
        const regEx = new RegExp(keyword, 'i'); //case sensitive

        const searchQuery = {
            $or : [
                {title: regEx},
                {description: regEx},
                {category: regEx},
                {brand: regEx},
            ]
        }
        const searchResults = await Product.find(searchQuery);
        res.status(200).json({
            success: true,
            data: searchResults
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'error querying search'
        })
    }
};

module.exports = {productSearch};
