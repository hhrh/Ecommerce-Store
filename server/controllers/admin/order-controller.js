const Order = require("../../models/Order");

const getAllUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({  });
        console.log(orders, "ORDERS");

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "No orders found",
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error getting orders",
        });
    }
};

const getOrderDetailsAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error getting order details",
        });
    }
};

const updateOrderStatus = async (req, res)=>{
    try {
        const {id} = req.params;
        const {orderStatus} =req.body;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        await Order.findByIdAndUpdate(id, {orderStatus});

        res.status(200).json({
            success: true,
            message: "order status updated.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error getting orders",
        });
    }
}

module.exports = {getAllUserOrders, getOrderDetailsAdmin, updateOrderStatus};