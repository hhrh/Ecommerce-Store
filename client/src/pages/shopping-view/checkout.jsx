import Address from "@/components/shopping-view/addresses";
import topImg from "../../assets/account.jpg"
import { useDispatch, useSelector } from "react-redux";
import CartTile from "@/components/shopping-view/cart-tile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchListingDetails } from "@/store/shop/listing-slice";
import { createOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";

function ShoppingCheckout() {
    const { user } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.cart);
    const guestCartItems = useSelector((state) => state.guestCartItems.items);
    const { payerActionUrl } = useSelector((state)=>state.order);
    const [guestCart, setGuestCart] = useState([]);
    const [isOrderCreated, setisOrderCreated] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {toast} = useToast()
    const checkoutItems = user ? cartItems.items : guestCart
    console.log(checkoutItems, "items")

    const cartTotal = checkoutItems && checkoutItems.length > 0 ?
        checkoutItems.reduce((sum, currentItem) => {
            return sum + (
                currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price
            ) * currentItem?.quantity
        }, 0)
        : 0;

    function handlePaypalPayment() {
        if (checkoutItems.length <= 0) {
            toast({
                title: 'Your cart is empty.',
                variant: 'destructive'
            })
            return;
        } else if(selectedAddress === null) {
            toast({
                title: 'Please select an address to ship to.',
                variant: 'destructive'
            })
            return;
        }

        const orderData = {
            userId: user?.id,
            cartItems: checkoutItems.map(item=>({
                productId: item?.productId,
                title: item?.title,
                image: item?.image,
                price: item?.salePrice > 0 ? item?.salePrice : item?.price,
                quantity: item?.quantity,

            })),
            addressInfo: {
                firstName: selectedAddress?.firstName,
                lastName: selectedAddress?.lastName,
                addressId: selectedAddress?._id,
                address: selectedAddress?.address,
                aptSuite: selectedAddress?.aptSuite,
                city: selectedAddress?.city,
                state: selectedAddress?.state,
                country: selectedAddress?.country,
                zipcode: selectedAddress?.zipcode,
                phone: selectedAddress?.phone,
                notes: selectedAddress?.notes,
            },
            orderStatus: 'pending',
            paymentMethod: 'paypal',
            paymentStatus: 'pending',
            totalAmount: cartTotal,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: '',
            payerId: '',
            cartId: cartItems?._id,
        }
        
        dispatch(createOrder(orderData)).then(data=>{
            if (data.payload.success) {
                setisOrderCreated(true);
            } else {
                setisOrderCreated(false);
            }
        });
    }

    if (payerActionUrl) {
        window.location.href = payerActionUrl;
    }

    useEffect(() => {
        const fetchGuestCartDetails = async () => {
            if (!user) {
                const updatedCartItems = await Promise.all(
                    guestCartItems.map(async (item) => {
                        const data = await dispatch(fetchListingDetails(item.productId));
                        if (data?.payload?.success) {
                            return { ...data.payload.data, ...item };
                        }
                        return null; // Handle failed fetch
                    })
                );
                setGuestCart(updatedCartItems.filter(Boolean));
            }
        };
        fetchGuestCartDetails();
    }, [user, guestCartItems, dispatch]);

    return (
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img
                    src={topImg}
                    className="h-full w-full object-cover object-center"
                />
            </div>
            <div className="grid md:grid-cols-2 gap-3 mt-5 p-4">
                <Address setSelectedAddress={setSelectedAddress} selectedId={selectedAddress?._id}/>
                <Card>
                    <CardHeader>
                        <CardTitle>Your Cart</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                        <div>
                            {
                                checkoutItems && checkoutItems.length > 0
                                    ? checkoutItems.map(item =>
                                        <div className="mb-3">
                                            <CartTile cartItem={item} />
                                        </div>
                                    )
                                    :
                                    <div className="flex flex-col m-5">
                                        <p className="font-extrabold">Your shopping cart is empty.</p>
                                        <Button variant="outline" onClick={() => navigate("/shop/home")} className="mt-5">Continue Shopping</Button>
                                    </div>

                            }
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between">
                                <span className="font-bold">Total</span>
                                <span className="font-bold">${cartTotal}</span>
                            </div>
                        </div>
                        <div className="mt-4 w-full">
                            <Button onClick={handlePaypalPayment} className="w-full">
                                {
                                    isOrderCreated ? 'Processing Paypal payment...' : 'Checkout with PayPal'
                                }
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default ShoppingCheckout;