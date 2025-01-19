import { Card, CardContent } from '@/components/ui/card'
import { Button } from '../../components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllListings, fetchListingDetails } from '@/store/shop/listing-slice'
import ShoppingListingTile from './listing-tile'
import { useNavigate } from 'react-router-dom'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { useToast } from '@/hooks/use-toast'
import { guestAddItem } from '@/store/shop/guestCart-slice'
import { getFeatureImages } from '@/store/common/feature-slice'

const categories = [
    { id: "men", label: "Men", },
    { id: "women", label: "Women", },
    { id: "kids", label: "Kids", },
    { id: "accessories", label: "Accessories", },
    { id: "footwear", label: "Footwear", },
]

const brands = [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
]

function ShoppingHome() {
    const {Listings} = useSelector(state=>state.shopListings)
    const {cartItems} = useSelector(state=>state.cart)
    const {guestCartItems} = useSelector(state=>state.guestCartItems)
    const { imageList } = useSelector(state => state.featuredImages)
    const {user} = useSelector(state=>state.auth)
    const [currentSlide, setCurrentSlide] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {toast} = useToast();
    const selectCartItems = user ? cartItems : guestCartItems;

    function handleNavToListingPage(sectionItem, section) {
        sessionStorage.removeItem('filters');
        const currentFilter = {
            [section] : [sectionItem.id]
        }
        sessionStorage.setItem('filters', JSON.stringify(currentFilter))
        navigate('/shop/listing')
    }

    //get product details when click on a card
    function handleGetProductDetails(getProductId) {
        dispatch(fetchListingDetails(getProductId));
    }

    function handleAddToCart(product) {
        const productId = product._id;
        const totalStock = product.totalStock;

        let items = selectCartItems || [];
        if (items.length) {
            const itemIndex = items.findIndex(item => item.productId === productId)
            if (itemIndex > -1) {
                const quantity = items[itemIndex].quantity
                if (quantity + 1 > totalStock) {
                    toast({
                        title: `Only ${totalStock} in stock!`,
                        description: items[itemIndex].title,
                        variant: "destructive"
                    })
                    return;
                }
            }
        }
        //if not logged in, use guest cart:
        if (!user) {
            dispatch(guestAddItem({ productId, quantity: 1 }));
            toast({
                title: "Product added to cart."
            })
            return;
        }
        dispatch(addToCart({ userId: user?.id, productId: productId, quantity: 1 })).then(data => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({
                    title: "Item added to cart.",
                    description: product.title
                })
            }
        })
        return;
    }


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % imageList.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [imageList.length]);

    useEffect(()=>{
        dispatch(fetchAllListings({ filterParams: {}, sortParams: 'price-lowtohigh'}))
    }, [dispatch])

    useEffect(() => {
        dispatch(getFeatureImages());
    }, [dispatch])

    return (
    <div className="flex flex-col min-h-screen">
            
        <div className="relative w-full h-[450px] overflow-hidden ">
            {
                imageList && imageList.length > 0 ?
                imageList.map((slide,index)=>
                    <img 
                        src={slide?.secureUrl} key={index}
                        className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}/>
                ) : null
            }
            <Button variant="outline" size="icon" className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50"
                onClick={()=>setCurrentSlide(prevSlide=>(prevSlide-1 + imageList.length) % imageList.length)}>
                <ChevronLeftIcon className='w-4 h-4'/>
            </Button>
            <Button variant="outline" size="icon" className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50"
                    onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1) % imageList.length)}>
                <ChevronRightIcon className='w-4 h-4' />
            </Button>
                <div className="absolute inset-0 flex items-end justify-start pointer-events-none m-5">
                    <div className="bg-black bg-opacity-50 text-white p-2 px-8 rounded-lg shadow-lg text-center max-w-lg pointer-events-auto flex m-5">
                        <div className='flex flex-col justify-end'>
                        <h1 className="text-3xl mb-4 font-black h-3">EXAMPLE</h1>
                        <h1 className="text-xl font-bold mb-4 font-serif">Sporting Goods</h1>
                        </div>
                        <button className="bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-200 transition ml-5 my-5"
                        onClick={()=>navigate('/shop/listing')}>
                            Shop Now
                        </button>
                    </div>
                </div>
        </div>

        <section className='py-12 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-left mb-8'>Shop by category</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                    {
                        categories.map(item=>
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={()=>handleNavToListingPage(item, "category")}
                            key={item.id}>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <h3 className='font-bold text-primary'>{item.label}</h3>
                            </CardContent>
                        </Card>)
                    }
                </div>
            </div>
        </section>

        <section className='py-12 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-left mb-8'>Shop by brand</h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                    {
                        brands.map(item=>
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleNavToListingPage(item, "brand")}
                            key={item.id}>
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <h3 className='font-bold text-primary'>{item.label}</h3>
                            </CardContent>
                        </Card>)
                    }
                </div>
            </div>
        </section>

        <section className='py-12 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-left mb-8'>Featured</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {
                        Listings && Listings.length > 0 ?
                        Listings.map(item=>
                            <ShoppingListingTile
                                handleGetProductDetails={handleGetProductDetails}
                                product={item}
                                handleAddToCart={handleAddToCart}
                                key={item.title}/>
                        ) : null
                    }
                </div>
            </div>
        </section>
    </div>
    )
}

export default ShoppingHome;