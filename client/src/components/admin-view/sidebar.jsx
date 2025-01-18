import { cn } from "@/lib/utils";
import { ChartSpline, ClipboardList, LayoutList, LayoutTemplate, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export const adminSidebarMenuItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: <LayoutTemplate size={25} className="text-blue-400"/>
    },
    {
        id: 'orders',
        label: 'Orders',
        path: '/admin/orders',
        icon: <Receipt size={25} className="text-blue-400"/>
    },
    {
        id: 'products',
        label: 'Products',
        path: '/admin/products',
        icon: <LayoutList size={25} className="text-blue-400"/>
    }
]

function MenuItems({setOpen}) {
    const navigate = useNavigate()
    return <nav className="mt-8 flex-col gap-2">
        {
            adminSidebarMenuItems.map(
                (menuItem)=> <div
                    key={menuItem.id}
                    onClick={() => {
                        navigate(menuItem.path)
                        setOpen ? setOpen(false) : null;
                    }}

                    className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-white hover:bg-gray-700 p-3 transition-all duration-300">
                        {menuItem.icon}
                        <span>{menuItem.label}</span>
                </div>
            )
        }
    </nav>
}

function AdminSidebar({open, setOpen}) {
    const navigate = useNavigate()

    return (
        <>
            {/* open/close sidebar for mobile devices */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side='left' className="w-64 bg-gray-800 text-white">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="border-b mg-3 pt-10 pb-3">
                            <SheetTitle className="flex gap-2">
                                <ChartSpline size={30} className="text-green-400" />
                                <div className="text-xl font-extrabold tracking-wide text-white">Admin Panel</div>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems setOpen={setOpen}/>
                    </div>
                </SheetContent>
            </Sheet>

            <aside className="hidden lg:flex w-64 flex-col border-r bg-gray-800 text-white p-6 shadow-lg">
                <div 
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 p-3 rounded-lg transition-all duration-300"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    <ChartSpline size={30} className="text-green-400" />
                    <h1 className="text-xl font-extrabold tracking-wide">Admin Panel</h1>
                </div>

                {/* Additional Sidebar Options */}
                <MenuItems />
            </aside>
        </>
    );
}

export default AdminSidebar;