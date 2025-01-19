const paypal = require("@paypal/paypal-server-sdk");
const client = require('../../helpers/paypal');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId,
        } = req.body;
        console.log(totalAmount, req.body)

        const cartItemsMap = cartItems.map((item) => ({
            name: item.title,
            unitAmount: {
                currencyCode: "USD",
                value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
            sku: item.productId,
        }));

        const collect = {
            body: {
                intent: paypal.CheckoutPaymentIntent.Capture,
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: "USD",
                            value: parseFloat(totalAmount).toFixed(2),
                            breakdown: {
                                itemTotal: {
                                    currencyCode: "USD",
                                    value: parseFloat(totalAmount).toFixed(2),
                                },
                            },
                        },
                        items: cartItemsMap,
                    },
                ],
                paymentSource: {
                    paypal: {
                        experienceContext: {
                            returnUrl: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
                            cancelUrl: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
                        },
                    },
                },
            },
            prefer: "return=minimal",
        };

        const ordersController = new paypal.OrdersController(client);
        let payerActionUrl;
        try {
            const { result, ...httpResponse } = await ordersController.ordersCreate(collect);
            payerActionUrl = result.links.find(
                (link) => link.rel === "payer-action"
            ).href;
        } catch (error) {
            if (error instanceof paypal.ApiError) {
                console.log(error, "API Error");
            }
        }

        const newOrder = new Order({
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId,
        });

        await newOrder.save();
        res.status(201).json({
            success: true,
            payerActionUrl,
            orderId: newOrder._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error creating order"
        })
    }
}

//capturePayment called when buyer confirms (pays) their order thru paypal
const capturePayment = async (req, res) => {
    try {
        const { orderId, paymentId, payerId } = req.body;
        const order = await Order.findById(orderId)

        if(!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            })
        }

        order.paymentStatus = 'Paid'
        order.orderStatus = 'Processing';
        order.paymentId = paymentId;
        order.payerId = payerId;

        for (const item of order.cartItems) {
            let product = await Product.findById(item.productId)
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Not enough stock for this product: ${product.title}`
                })
            }

            product.totalStock -= item.quantity

            await product.save();
        }

        //delete the users cart from db
        const cartId = order.cartId;
        await Cart.findByIdAndDelete(cartId)

        await order.save()
        res.status(200).json({
            success: true,
            message: "Order confirmed.",
            data: order
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error capturing order",
        });
    }
};

const getAllOrdersByUser = async (req, res)=>{
    try{
        const {userId} = req.params;
        const orders = await Order.find({userId});

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: 'No orders found',
            })
        }

        res.status(200).json({
            success: true,
            data: orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error getting user orders"
        })
    }
}

const getOrderDetails = async (req, res) => {
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
            message: "Error getting order details.",
        });
    }
};

module.exports = { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails }