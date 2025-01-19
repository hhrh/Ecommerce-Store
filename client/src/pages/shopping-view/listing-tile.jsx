import ListingDetailsDialog from "@/components/shopping-view/listing-details";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { fetchListingDetails } from "@/store/shop/listing-slice";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";

function ShoppingListingTile({ product, handleAddToCart }) {
    const { ListingDetails } = useSelector(state => state.shopListings);
    const dispatch = useDispatch();
    //get product details when click on a card
    function handleGetProductDetails(productId) {
        dispatch(fetchListingDetails(productId)); //updates ListingDetails
    }

    return (
        <>
        <Dialog>
        <DialogTrigger asChild>
        <Card className="w-full max-w-sm mx-auto">
            <div onClick={()=>handleGetProductDetails(product?._id)}>
                <div className="relative">
                    <img
                        src={product?.images[0]?.secure_url}
                        alt={product?.title}
                        className="w-full h-[300px] object-contain rounded-lg"
                    />
                    {
                    product?.totalStock === 0 ? (
                        <Badge className="absolute top-2 left-2 bg-red-400 hover:bg-red-600">
                            Out of stock
                        </Badge>
                    ) : product?.totalStock <= 10 ? (
                                            <Badge className="absolute top-2 left-2 bg-red-400 hover:bg-red-600">
                                                {`Only ${product?.totalStock} left`}
                                            </Badge>
                    ) :
                    product?.salePrice > 0 ? (
                        <Badge className="absolute top-2 left-2 bg-red-400 hover:bg-red-600">
                            Sale
                        </Badge>
                    ) : null}
                        <CardContent className="p-4">
                        <h2 className="text-xl font-bold mb-2 h-14 text-ellipsis overflow-hidden">
                            {product?.title}
                        </h2>
                        <div className="flex justify-between items-center mb-2 capitalize">
                            <span className="text-sm text-muted-foreground">
                                {product?.category}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {product?.brand}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span
                                className={`${
                                    product?.salePrice > 0 ? "line-through text-muted-foreground text-md" : "text-primary text-lg"
                                } font-semibold`}>
                                ${product?.price}
                            </span>
                            {product?.salePrice > 0 ? (
                                <span className="text-lg font-semibold text-primary">
                                    ${product?.salePrice}
                                </span>
                            ) : null}
                        </div>
                    </CardContent>
                </div>
            </div>
            <CardFooter>
                <Button onClick={(event)=>{
                    event.stopPropagation();
                    handleAddToCart(product);
                }} className="w-full"
                    disabled={product?.totalStock <= 0}
                >{product?.totalStock <= 0 ? "Out of stock" : 'Add to cart'}</Button>
            </CardFooter>
        </Card>
        </DialogTrigger>
        <ListingDetailsDialog listingDetails={ListingDetails} handleAddToCart={handleAddToCart} />
        </Dialog>
        </>
    );
}

export default ShoppingListingTile;
