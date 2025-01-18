import { LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

function AdminHeader({setOpen}) {
    const {toast} = useToast();
    const navigate = useNavigate();

    const dispatch = useDispatch()
    function handleLogout() {
        dispatch(logoutUser()).then((data)=>{
            if(data?.payload?.success) {
                toast({
                    title: data?.payload?.message || 'Logged out successfully.'
                })
                navigate("/shop/home");
                return;
            }
        })
    }

    return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
        <Button onClick={()=>setOpen(true)} className="lg:hidden sm:block">
            <Menu />
            <span className="sr-only">Toggle menu.</span>
        </Button>
        <div className="flex flex-1 justify-end">
            <Button onClick={handleLogout}className="inline-flex gap-2 items-center rounded-md px-4 py-2 font-medium shadow">
                <LogOut />
                Logout
            </Button>
        </div>
    </header>
    )
}

export default AdminHeader;