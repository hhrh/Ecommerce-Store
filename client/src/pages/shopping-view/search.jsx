import { Input } from "@/components/ui/input";
import { clearSearchResults, getSearchResults } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ShoppingListingTile from "./listing-tile";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

function SearchPage() {
    const [keyword, setkeyword] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const {results} = useSelector(state=>state.search);
    const {cartItems} = useSelector(state=>state.cart);
    const {user} = useSelector(state=>state.auth);
    const dispatch = useDispatch();
    const {toast} = useToast();

    function handleAddToCart(productId, totalStock) {
        let items = cartItems.items || []
        if (items.length) {
            const itemIndex = items.findIndex(item => item.productId)
            if (itemIndex > -1) {
                const quantity = items[itemIndex].quantity
                console.log("called", totalStock, quantity)
                if (quantity + 1 > totalStock) {
                    toast({
                        title: `Only ${quantity} in stock.`,
                        variant: "destructive"
                    })
                    return;
                }
            }
        }
        const guestAddToCart = (productId) => {
            dispatch(guestAddItem({ productId, quantity: 1 }));
            toast({
                title: "Product added to cart."
            })
        };
        dispatch(addToCart({ userId: user?.id, productId: productId, quantity: 1 })).then(data => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({
                    title: "Product added to cart."
                })
            }
        })
    }

    const guestAddToCart = (productId) => {
        dispatch(guestAddItem({ productId, quantity: 1 }));
        toast({
            title: "Product added to cart."
        })
    };

    useEffect(()=>{
        if (keyword && keyword.trim() !== '' && keyword.trim().length > 3) {
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
                dispatch(getSearchResults(keyword))
            }, 1000);
        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            dispatch(clearSearchResults());
        }
    }, [keyword, dispatch])
    return ( 
        <div className="container mx-auto md:px-6 px-4 py-8">
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <Input value={keyword} name="keyword" onChange={(event)=>setkeyword(event.target.value)} className='py-8' placeholder="Search products"/>
                </div>
            </div>
            {!results.length ? (
                <h2 className="font-extrabold">No result found.</h2>
            ) : null}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-4 gap-5">
                {
                    results.map(result => <ShoppingListingTile
                        product={result}
                        handleAddToCart={user ? handleAddToCart : guestAddToCart}/>)
                }
            </div>
        </div>
     );
}

export default SearchPage;