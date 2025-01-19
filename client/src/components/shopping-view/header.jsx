import { House, LogOut, Menu, ShoppingCart, User, UserCog, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderItems } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import CartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { fetchAllListings } from "@/store/shop/listing-slice";
import { useToast } from "@/hooks/use-toast";

function MenuItems() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [filters, setFilters] = useState(() =>
        JSON.parse(sessionStorage.getItem('filters')) || null
    );

    function handleNav(menuItem) {
        sessionStorage.removeItem('filters')
        if (menuItem.id === 'home' || menuItem.id === 'search' || menuItem.id === 'all') {
            navigate(menuItem.path)
        } else { 
        const currentFilter = {category : [menuItem.id]}
            sessionStorage.setItem('filters', JSON.stringify(currentFilter))
            setFilters(currentFilter)
            navigate(`${menuItem.path}`);
        }
    }
    // Dispatch fetchAllListings whenever filters change
    useEffect(() => {
        if (filters) {
            dispatch(fetchAllListings({ filterParams: filters, sortParams: 'price-lowtohigh' }));
        }
    }, [filters, dispatch]);

    return (
        <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
            {shoppingViewHeaderItems.map((menuItem) => (
                <Label
                    key={menuItem.id}
                    className="text:sm font-medium cursor-pointer"
                    onClick={()=>handleNav(menuItem)}>
                    {menuItem.label}
                </Label>
            ))}
        </nav>
    );
}

//returns cart icon, avatar icon
function HeaderRightContent() {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    const [openCart, setOpenCart] = useState(false);
    const { cartItems } = useSelector(state => state.cart);
    const guestCartItems = useSelector(state => state.guestCartItems);
    const cartTileItems = user ? cartItems : guestCartItems;
    const {toast} = useToast();
    console.log(cartTileItems)
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleLogout() {
        console.log(user, "logouted?")
        dispatch(logoutUser()).then((data) => {
            console.log(data, "data")
            if (data?.payload?.success) {
                toast({
                    title: data?.payload?.message || 'Logged out successfully.'
                })
                navigate("/shop/home");
                return;
            }})
    }

    useEffect(()=>{
        user ? dispatch(fetchCartItems(user?.id)) : null
    },[dispatch])

    return (
        <div className="flex lg:items-center lg:flex-row flex-col gap-4">
            {/* Cart icon top right */}
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <ShoppingCart className="w-6 h-6" />
                        <span className="">{cartTileItems?.items?.length || "0"}</span>
                    <span className="sr-only">User cart</span>
                </Button>
                </SheetTrigger>
                    <CartWrapper 
                        cartItems={cartTileItems}/>
            </Sheet>
            {/* Avatar icon top right */}
            {isAuthenticated ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="bg-black cursor-pointer">
                            <AvatarFallback className="bg-teal-400 text-white font-extrabold">
                                {user?.userName[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" className="w-56">
                        <DropdownMenuLabel>
                            Logged in as {user?.userName}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigate("/shop/account")}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="bg-black cursor-pointer">
                            <AvatarFallback className="bg-gray-400 text-white font-extrabold">
                                <User className="h-6 w-6" />
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" className="w-56">
                        <DropdownMenuLabel>
                            Guest
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => navigate("/auth/login")}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Log in
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/auth/register")}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create an account
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}

//header at top of page
function ShoppingHeader() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background shadow-md">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                {/* Brand Logo and Name */}
                <Link
                    to="/shop/home"
                    className="flex items-center gap-2"
                    aria-label="Go to homepage"
                >
                    <div className="flex flex-col border p-1 rounded-full px-4">
                    <div className="font-bold text-lg text-gray-800 hover:text-gray-600">
                        <div className="flex w-full justify-center h-6 font-bold font-extrabold">EXAMPLE</div>
                        <div className="text-sm font-serif text-blue-500">Sporting Goods</div>
                    </div>
                    </div>
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="lg:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle header menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="w-full max-w-xs">
                        <MenuItems />
                        <HeaderRightContent />
                    </SheetContent>
                </Sheet>
                <div className="hidden lg:block">
                    <MenuItems />
                </div>
                <div className="hidden lg:block">
                    <HeaderRightContent />
                </div>
            </div>
        </header>
    );
}

export default ShoppingHeader;