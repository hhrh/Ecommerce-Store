const Cart = require('../../models/Cart')
const Product = require("../../models/Product");

const addToCart = async(req, res)=>{
    try {
        //get info from client
        const { userId, productId, quantity } = req.body;

        //error check
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid productId or quantity or userId",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found!",
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({userId, items: []})
        }

        //does this users cart have this specific item?
        const productIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (productIndex === -1) {
            cart.items.push({ productId, quantity });
        }  else {
            cart.items[productIndex].quantity += quantity;
        }

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'failed to add cart item.'
        })
    }
}

const fetchCartItems = async (req, res) => {
    try {
        const {userId} = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is manadatory!",
            });
        }

        const cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            select: "images title price salePrice",
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found!",
            });
        }

        //what if admin deleted an item that your cart has?
        const validItems = cart.items.filter(item=> item.productId)

        if (validItems.length < cart.items.length) {
            cart.items = validItems
            await cart.save();
        }

        const populateCartItems = validItems.map(item=>({
                productId: item.productId._id,
                images: item.productId.images,
                title: item.productId.title,
                price: item.productId.price,
                salePrice: item.productId.salePrice,
                quantity: item.quantity,
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "failed to fetch cart items",
        });
    };
};

const updateCartItemQty = async (req, res) => {
    try {
        //get info from client
        const { userId, productId, quantity } = req.body;

        //error check
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid productID or quantity or userId",
            });
        }
        
        const cart = await Cart.findOne({userId});
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found!'
            })
        }

        //find the item in the cart
        const itemIndex = cart.items.findIndex(
            (item)=>item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "item not found in cart."
            })
        }

        cart.items[itemIndex].quantity = quantity;

        await cart.save();

        await cart.populate({
            path: "items.productId",
            select: "images title price salePrice",
        });

        const populateCartItems = cart.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            images: item.productId ? item.productId.images : null,
            title: item.productId ? item.productId.title: "Product not found",
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity,
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems,
            }
        })
 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update cart item.",
        });
    }
};

const deleteCartItem = async (req, res) => {
    const {userId} = req.params;
    const {productId} = req.params;
    try {
        if (!productId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and userId required.',
            });
        }

        const cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            select: "images title price salePrice",
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found.",
            });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(
            (item) => item.productId._id.toString() !== productId
        );

        await cart.save();

        await cart.populate({
            path: "items.productId",
            select: "images title price salePrice",
        });

        const populateCartItems = cart.items.map((item) => ({
            productId: item.productId ? item.productId._id : null,
            images: item.productId ? item.productId.images : null,
            title: item.productId ? item.productId.title : "Product not found",
            price: item.productId ? item.productId.price : null,
            salePrice: item.productId ? item.productId.salePrice : null,
            quantity: item.quantity,
        }));

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete cart item.",
        });
    }
};

//for existing users with local storage cart (guestcart) items.
//merge guestcart with cart in account
const mergeCarts = async (req, res) => {
    try {
        const { userId, guestCart } = req.body;

        // Fetch the user's cart
        let userCart = await Cart.findOne({ userId });
        if (!userCart) {
            // Create a new cart if none exists
            userCart = new Cart({ userId, items: [] });
        }

        // Merge guestCart with userCart
        const mergedItems = [...userCart.items];

        guestCart.items.forEach((guestItem) => {
            const existingItem = mergedItems.find(
                (userItem) =>
                    userItem.productId.toString() === guestItem.productId
            );

            if (existingItem) {
                // Update quantity for existing item
                existingItem.quantity += guestItem.quantity;
            } else {
                // Add new item from guestCart
                mergedItems.push(guestItem);
            }
        });

        // Save the merged cart back to the database
        userCart.items = mergedItems;
        await userCart.save();

        res.status(200).json({
            success: true,
            message: "items from guest cart added to your account",
            data: userCart,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error merging carts.",
        });
    }
};

module.exports = {
    addToCart,
    fetchCartItems,
    updateCartItemQty,
    deleteCartItem,
    mergeCarts,
}