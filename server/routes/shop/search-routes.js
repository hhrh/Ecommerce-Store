const express = require("express");
const {productSearch} = require("../../controllers/shop/search-controller");

const router = express.Router();
router.get("/:keyword", productSearch);

module.exports = router;
