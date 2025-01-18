const express = require("express");
const { getAllUserOrders, getOrderDetailsAdmin, updateOrderStatus } = require("../../controllers/admin/order-controller");

const router = express.Router();
router.get("/get", getAllUserOrders);
router.get("/details/:id", getOrderDetailsAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
