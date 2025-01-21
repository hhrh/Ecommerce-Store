import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import { mergeCarts } from "@/store/shop/cart-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
    email : '',
    password : ''
}

function AuthLogin() {

    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch();
    const { toast } = useToast();

    function onSubmit(event) {
        event.preventDefault();
        dispatch(loginUser(formData)).then((data)=>{
            if (data?.payload?.success) {
                toast({
                    title: data?.payload?.message,
                })
                //if login successful, merge guest cart (if any) with user cart
                const guestCart = JSON.parse(localStorage.getItem('guestCart')); 
                if (guestCart) {
                    const userId = data?.payload?.user?.id;
                    dispatch(mergeCarts({userId, guestCart})).then((cartData)=>{
                        if (cartData?.payload?.success) {
                            // Clear guest cart from local storage
                            localStorage.removeItem("guestCart");
                            toast({
                                title: cartData?.payload?.message,
                            })
                        } else {
                            toast({
                                title: cartData?.payload?.message || 'Error merging carts.',
                                variant: 'destructive',
                            })
                        }
                    })
                }
            } else {
                toast({
                    title: data?.payload?.message || 'Error logging in.',
                    variant: 'destructive',
                })
            }
        })

    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in</h1>
                <p className="mt-2">
                    Don't have an account?
                        <Link className="font-medium ml-2 text-primary hover:underline" to={'/auth/register'}>
                            Register
                        </Link>
                </p>
            </div>
            <CommonForm
            formControls={loginFormControls}
            buttonText={'Sign In'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            />
        </div>
    )
}

export default AuthLogin;