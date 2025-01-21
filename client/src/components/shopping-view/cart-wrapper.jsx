import { fetchAllListings, fetchListingDetails } from "@/store/shop/listing-slice";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import CartTile from "./cart-tile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CartWrapper({cartItems}) {
    const { user } = useSelector(state => state.auth);
    const [guestCart, setGuestCart] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const finalCartItems = user ? cartItems.items : guestCart;
    console.log(finalCartItems)

    const cartTotal = finalCartItems && finalCartItems.length > 0 ?
        (finalCartItems.reduce((sum, currentItem) => {
            return sum + (
                currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price
            ) * currentItem?.quantity
        }, 0)).toFixed(2)
        : 0

    useEffect(() => {
        const fetchGuestCartDetails = async () => {
            if (!user) {
                const updatedCartItems = await Promise.all(
                    cartItems.items.map(async (item) => {
                        const data = await dispatch(fetchListingDetails(item.productId));
                        if (data?.payload?.success) {
                            return { ...data.payload.data, ...item };
                        }
                        return false; // Handle failed fetch
                    })
                );
                setGuestCart(updatedCartItems.filter(Boolean));
            }
        };
        fetchGuestCartDetails();
    }, [user, cartItems, dispatch]);

    useEffect(() => { //fetch products
        dispatch(fetchAllListings({ filterParams: null, sortParams: 'price-lowtohigh' }));
    }, [dispatch])

    return ( 
        <SheetContent className="sm:max-w-md overflow-y-scroll">
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-4">
                {
                    finalCartItems && finalCartItems.length > 0 ? 
                        finalCartItems.map(item => <CartTile key={item.title} cartItem={item}/>)
                        : <div>
                            <p className="font-medium text-muted-foreground">Your cart is empty</p>
                        </div>
                }
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${cartTotal}</span>
                </div>
            </div>
            <SheetTrigger className="w-full mt-5">
                <Button onClick={() => { navigate('/shop/checkout');}} className="w-full">Checkout</Button>
            </SheetTrigger>
        </SheetContent>
    );
}

export default CartWrapper;