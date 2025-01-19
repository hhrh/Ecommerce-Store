import { Outlet, useNavigate } from "react-router-dom";
import { ArrowLeftCircleIcon } from "lucide-react";
import { Button } from "../ui/button";

function AuthLayout() {
  const navigate = useNavigate();
    return (
      <div className="flex min-h-screen w-full">
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-bl from-black to-teal-600 w-1/2 px-12">
          <div className="max-w-md space-y-6 text-center text-primary-foreground">
            <h1 className="text-xl font-extrabold tracking-tight">
              Welcome to
              <div className='flex flex-col justify-end'>
                <h1 className="text-5xl mb-4 font-black h-6">EXAMPLE</h1>
                <h1 className="text-3xl font-bold mb-4 font-serif">Sporting Goods</h1>
              </div>
            </h1>
          </div>
        <Button className="absolute top-0 left-0 m-6" onClick={()=>navigate('/shop/home')}>
          <ArrowLeftCircleIcon/>Back
        </Button>
        </div>
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    );
  }

export default AuthLayout;