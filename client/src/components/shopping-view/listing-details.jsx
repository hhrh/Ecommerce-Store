import { StarIcon, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import StarRating from "../common/star-rating";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductReview, getProductReviews } from "@/store/shop/reviews-slice";
import { getAllOrdersByUser, getOrderDetails } from "@/store/shop/order-slice";
import { toast, useToast } from "@/hooks/use-toast";

function ListingDetailsDialog({listingDetails, handleAddToCart }) {
    const {user} = useSelector(state=>state.auth)
    const {userOrders, orderDetails} = useSelector(state=>state.auth);
    const { reviews } = useSelector(state=>state.reviews);
    const [reviewMsg, setReviewMsg] = useState("")
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const {toast} = useToast();

    const avgReview = //calculate average 5star review
        reviews && reviews.length > 0
            ? reviews.reduce(
                (sum, reviewItem) => sum + reviewItem.reviewValue,
                0
            ) / reviews.length
            : 5; // Default to 0 if no reviews
    
    function handleChangeRating(ratingValue) {
        console.log(ratingValue)
        setRating(ratingValue);
    }

    function handleAddReview() {
        if(rating === 0) {
            toast({
                title: 'Give a star rating to submit.',
                variant: 'destructive'
            })
            return;
        }
        dispatch(addProductReview({
            productId: listingDetails?._id,
            userId: user?.id,
            userName: user?.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating,
            country: 'United States',
            state: 'Arizona',
        })).then(data=>{
            if(data?.payload?.success) {
                dispatch(getProductReviews(listingDetails._id));
                toast({
                    title: 'Your review has been added.'
                })
                setRating(0);
                setReviewMsg('')
            }
        })
    }

    useEffect(()=>{
        if(listingDetails !== null) {
            dispatch(getProductReviews(listingDetails._id))
        }
    }, [dispatch, listingDetails])

    return (
            <DialogContent aria-describedby={undefined} className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={listingDetails?.image}
                        alt={listingDetails?.title}
                        width={600}
                        height={600}
                        className="aspect-square w-full object-cover"
                    />
                </div>
                <div>
                    <div>
                        <DialogTitle className="text-3xl font-extrabold">
                            {listingDetails?.title}
                        </DialogTitle>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">
                            {listingDetails?.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p
                            className={`${
                                listingDetails?.salePrice > 0
                                    ? "line-through text-muted-foreground"
                                    : "text-primary"
                            } text-3xl font-bold`}>
                            ${listingDetails?.price}
                        </p>
                        {listingDetails?.salePrice > 0 ? (
                            <p className="text-3xl font-bold text-primary">
                                ${listingDetails?.salePrice}
                            </p>
                        ) : null}
                    </div>
                    {/* general star rating */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            {
                                reviews && reviews.length ? <StarRating rating={avgReview} /> : null
                            }
                        </div>
                        <span className="text-muted-foreground">{reviews && reviews.length ? `(${avgReview.toFixed(2)})` : null}</span>
                    </div>
                    <div className="mt-6 mb-5">
                        <Button
                            onClick={()=>handleAddToCart(listingDetails)}
                            className="w-full"
                            disabled={listingDetails?.totalStock <= 0}
                    >{listingDetails?.totalStock <= 0 ? 'Out of stock' : 'Add to cart'}</Button>
                    </div>
                    <Separator />
                    {/* Reviews section */}
                    <div className="max-h[300px] overflow-auto">
                        <h2 className="text-xl font-bold mb-4 mt-4">Reviews</h2>

                        {/* User reviews list */}
                        <div className="grid gap-6">
                            {
                                reviews && reviews.length > 0
                                ? reviews.map(reviewItem=> 
                                    <div className="flex gap-4">
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarFallback className="bg-teal-400 text-white font-extrabold">
                                                {reviewItem?.userName[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold">{reviewItem?.userName}</h3>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                <StarRating rating={reviewItem?.reviewValue}/>
                                            </div>
                                            <p className="text-muted-foreground">{reviewItem?.reviewMessage}</p>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>

                        {/* Write a review: */}
                        <div className="m-10 flex gap-2 flex-col">
                            {/* Write a review: star rate */}
                            <Label>Write a review</Label>
                            <div className="flex gap-1">
                                <StarRating
                                    rating={rating}
                                    handleChangeRating={handleChangeRating}
                                />
                            </div>

                            {/* Write a review: input message */}
                        <div className="flex gap-1">
                            <Avatar>
                            {
                            user
                            ? <AvatarFallback className="bg-teal-400 text-white font-extrabold">
                                {user?.userName[0].toUpperCase()}
                            </AvatarFallback>
                            : <AvatarFallback className="bg-gray-400 text-white font-extrabold">
                                <User className="h-6 w-6" />
                            </AvatarFallback>
                            }
                            </Avatar>
                            <Input
                                name='reviewMsg'
                                value={reviewMsg}
                                onChange={(event)=>setReviewMsg(event.target.value)}
                                placeholder="Write a review..."/>
                        </div>
                            <Button
                                onClick={handleAddReview}
                                disabled={reviewMsg.trim() === ''}
                                >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
    );
}

export default ListingDetailsDialog;
