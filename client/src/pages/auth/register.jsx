import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { mergeCarts } from "@/store/shop/cart-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
    userName : '',
    email : '',
    password : ''
}

function AuthRegister() {

    const [formData, setFormData] = useState(initialState)
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        username: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    const validateForm = () => {
        let valid = true;
        let errors = {};

        // Email Validation (simple check for valid format)
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(formData.email)) {
            errors.email = "Please enter a valid email address.";
            valid = false;
        }

        // Password Validation (at least 6 characters)
        if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
            valid = false;
        }

        // Username Validation (should not be empty)
        if (formData.userName.trim() === "") {
            errors.username = "Username is required.";
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    function onSubmit(event) {
        event.preventDefault()
        if (validateForm()) {
        dispatch(registerUser(formData)).then((data) => {
            console.log(data)
            if (data?.payload?.success) {
                toast({
                    title: data?.payload?.message,
                });
                setFormData(initialState);
                navigate('/auth/login');
            } else {
                toast({
                    title: data?.payload?.message || 'Error registering user.',
                    variant: "destructive",
                });
            }
        })}
    }

    console.log(formData)

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
                <p className="mt-2">
                    Already have an account?
                        <Link className="font-medium ml-2 text-primary hover:underline" to={'/auth/login'}>
                            Login
                        </Link>
                </p>
            </div>
            {errors.username && <p className="text-red-500 text-sm ">{errors.username}</p>}
            {errors.email && <p className="text-red-500 text-sm ">{errors.email}</p>}
            {errors.password && <p className="text-red-500 text-sm ">{errors.password}</p>}
            <CommonForm
            formControls={registerFormControls}
            buttonText={'Sign Up'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            />
        </div>
    )
}

export default AuthRegister;