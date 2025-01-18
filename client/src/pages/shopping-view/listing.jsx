import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { ArrowUpDownIcon } from "lucide-react";
import ShoppingListingTile from "./listing-tile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllListings, fetchListingDetails } from "@/store/shop/listing-slice";
import { useState } from "react";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { guestAddItem } from "@/store/shop/guestCart-slice";

//helper function: creates a URL string to identify what to search for.
function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    //loop through each section (category:..., brand:...)
    //and create a URI compatible string. based on filters.
    for(const [key, value] of Object.entries(filterParams)){
        if(Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(',') //
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
        }
    }
    //category=...&brand=...
    return queryParams.join("&");
}

function ShoppingListing() {
    const dispatch = useDispatch();
    const { Listings } = useSelector(state => state.shopListings);
    const { cartItems } = useSelector(state => state.cart);
    const {user} = useSelector(state=>state.auth);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const {toast} = useToast();

    function handleSort(value) {
        setSort(value)
    }

    //handle saving filters selected to filters state, and saving state on page load (sessionStorage).
    function handleFilter(getSectionId, getCurrentOption) {
        let cpyFilters = {...filters};
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        if(indexOfCurrentSection === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId]: [getCurrentOption]
            } 
        } else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption)
            if (indexOfCurrentOption === -1) {
                cpyFilters[getSectionId].push(getCurrentOption)
            } else {
                cpyFilters[getSectionId].splice(indexOfCurrentOption, 1)
            }
        }
        setFilters(cpyFilters)  
        sessionStorage.setItem("filters", JSON.stringify(cpyFilters)) 
    }

    function handleAddToCart(product){
        const productId = product._id;
        const totalStock = product.totalStock;

        //if not logged in, use guest cart:
        if (!user) {
            dispatch(guestAddItem({ productId, quantity: 1 }));
            toast({
                title: "Product added to cart."
            })
            return;
        }
        
        let items = cartItems.items || []
        if (items.length) {
            const itemIndex = items.findIndex(item=>item.productId === productId)
            if(itemIndex > -1) {
                const quantity = items[itemIndex].quantity
                if (quantity+1 > totalStock) {
                    toast({
                        title: `Only ${totalStock} in stock!`,
                        description: items[itemIndex].title,
                        variant: "destructive"
                    })
                    return;
                }
            }
        }
        dispatch(addToCart({ userId: user?.id, productId: productId, quantity: 1 })).then(data=>{
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({
                    title: "Item added to cart.",
                    description: product.title
                })
            }
        })
    }


    //select a default sort option and save filters on page reload
    useEffect(()=>{
        setSort('price-lowtohigh');
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
    },[searchParams])

    //apply filter options to the url
    useEffect(()=>{
        if(filters && Object.keys(filters).length > 0){
            const createQueryString = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(createQueryString));
        }
    }, [filters])

    useEffect(() => { //fetch products
        if(filters !== null && sort !== null)
            dispatch(fetchAllListings({filterParams : filters, sortParams : sort}));
    }, [dispatch, sort, filters])

    return (<div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
        {/* Filters side panel */}
        <ProductFilter filters={filters} handleFilter={handleFilter} />

        {/* Main all products header */}
        <div className="bg-background w-full rounded-lg shadow-md">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-extrabold">All Products</h2>
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{Listings.length} products</span>
                    
                    {/* Sort by button */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <ArrowUpDownIcon className="h-4 w-4" />
                                <span>Sort by</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                {
                                    sortOptions.map(sortItem =>
                                        <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>{sortItem.label}</DropdownMenuRadioItem>
                                    )
                                }
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* fetch all listings below header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {
                    Listings && Listings.length > 0 ? (
                        Listings.map((listing) =>
                            <ShoppingListingTile handleAddToCart={handleAddToCart} key={listing._id} product={listing} />
                        )
                    ) : null
                }
            </div>
        </div>
    </div>);
}

export default ShoppingListing;