import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartItemQty } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { guestRemoveItem, guestUpdateQty } from "@/store/shop/guestCart-slice";

function CartTile({ cartItem }) {
    const { cartItems } = useSelector(state => state.cart);
    const { Listings } = useSelector(state => state.shopListings);
    const { user } = useSelector(state => state.auth);
    const { toast } = useToast();
    const dispatch = useDispatch();

    function handleDeleteCartItem(item) {
        if (user) {
            dispatch(deleteCartItem({
                userId: user?.id,
                productId: item?.productId
            })).then(data => {
                if (data?.payload?.success) {
                    toast({
                        title: "Item has been deleted"
                    })
                }
            })
        } else {
            dispatch(guestRemoveItem(item?.productId));
            toast({
                title: "Item has been deleted"
            })
        }

    }

    function handleUpdateQty(cartItem, updateType) {
        if (updateType === 'plus') {
            const productIndex = Listings.findIndex(item=>item._id === cartItem.productId)
            if(productIndex > -1) {
                const currtotalStock = Listings[productIndex].totalStock
                if (cartItem.quantity + 1 > currtotalStock) {
                    toast({
                        title: `Only ${currtotalStock} in stock!`,
                        description: cartItem.title,
                        variant: "destructive"
                    })
                    return;
                }
            }
        }
        if (user) {
            dispatch(updateCartItemQty({
                userId: user?.id,
                productId: cartItem?.productId,
                quantity: updateType === "minus"
                    ? cartItem?.quantity - 1
                    : cartItem?.quantity + 1
            })).then(data => {
                if (data?.payload?.success) {
                    toast({
                        title: "item quantity updated"
                    })
                }
            })
        } else {
            let updateQuantity = updateType === "minus" ? cartItem?.quantity - 1 : cartItem?.quantity + 1
            dispatch(guestUpdateQty({ productId: cartItem?.productId, quantity: updateQuantity }));
            toast({
                title: "item quantity updated"
            })
        }
    }

    return (
        <div className="flex items-center space-x-4 hover:bg-primary-foreground transition-all duration-300 rounded-lg p-2 shadow-md">
            <img src={cartItem?.image} alt={cartItem?.title} className="w-20 h-20 rounded object-cover" />
            <div className="flex-1">
                <h3 className="font-extrabold">{cartItem?.title}</h3>
                <div className="flex items-center mt-1 gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleUpdateQty(cartItem, 'minus')}
                        disabled={cartItem?.quantity === 1}>
                        <Minus className="w-4 h-4" />
                        <span className="sr-only">Decrease</span>
                    </Button>
                    <span className="font-semibold">{cartItem?.quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleUpdateQty(cartItem, 'plus')}>
                        <Plus className="w-4 h-4" />
                        <span className="sr-only">Increase</span>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-semibold">
                    {
                        ((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price)
                            * cartItem?.quantity).toFixed(2)
                    }
                </p>
                <Button onClick={() => handleDeleteCartItem(cartItem)}
                    className="h-8 w-8 rounded-full mt-2 mr-2"
                    variant="outline"
                    size="icon">
                    <Trash className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

export default CartTile;