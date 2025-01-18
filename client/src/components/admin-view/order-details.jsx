import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserOrders, getOrderDetailsAdmin, updateOrderStatus } from "@/store/admin/order-slice";
import { getAllOrdersByUser } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";


const initialFormData = {
    status: '',
}

function AdminOrderDetails({details}) {
    const { user } = useSelector(state => state.auth);
    const [formData, setFormData] = useState(initialFormData);
    const dispatch = useDispatch();
    const {toast} = useToast();
    

    function handleOrderStatus(event) {
        event.preventDefault();
        const {status} = formData
        dispatch(updateOrderStatus({ id: details?._id, orderStatus: status})).then(data=>{
            if(data?.payload?.success) {
                dispatch(getOrderDetailsAdmin(details?._id));
                dispatch(getAllUserOrders());
                setFormData(initialFormData);
                toast({
                    title: "Order updated successfully."
                })
            }
        })
    }

    return (
        <DialogContent className="lg:max-w-[800px] max-h-full overflow-scroll">
            <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="grid gap-2">
                    <div className="flex items-center justify-between ">
                        <p className="font-medium">Order ID</p>
                        <Label>{details?._id}</Label>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="font-medium">Order Date</p>
                        <Label>{details?.orderDate?.split('T')[0]}</Label>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="font-medium">Payment Method</p>
                        <Label>{details?.paymentMethod}</Label>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="font-medium">Payment Status</p>
                        <Label>{details?.paymentStatus}</Label>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="font-medium">Order Status</p>
                        <Label>
                            <Badge className={`py-1 px-3 ${
                                details?.orderStatus === 'Delivered' 
                                ? "bg-green-500 hover:bg-green-400" 
                                : (details?.orderStatus === 'Cancelled'
                                || details?.orderStatus === 'Rejected')
                                ? "bg-red-500 hover:bg-red-400"
                                : "bg-slate-500 hover:bg-slate-400"
                                }`}>
                                {details?.orderStatus}
                            </Badge>
                        </Label>
                    </div>
                    <Separator className="my-2" />
                                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="font-bold">Summary</div>
                            <Table className="border">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        details?.cartItems && details?.cartItems.length > 0
                                            ? details?.cartItems.map(item =>
                                                <TableRow>

                                                    <TableCell>{item?.title}</TableCell>
                                                    <TableCell>{item?.quantity}</TableCell>
                                                    <TableCell>${item?.price}</TableCell>
                                                </TableRow>
                                            )
                                            : null
                                    }
                                </TableBody>
                            </Table>
                            <div className="flex items-center justify-between">
                                <p className="font-medium">Order Price</p>
                                <Label className="text-md">${details?.totalAmount}</Label>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="font-bold">
                                Shipping info
                            </div>
                            <div className="grid gap-0.5 text-muted-foreground">
                                <span>{user?.userName}</span>
                                <span>{details?.addressInfo?.phone}</span>
                                <span>{details?.addressInfo?.address}</span>
                                <span>{details?.addressInfo?.city}</span>
                                <span>{details?.addressInfo?.zipcode}</span>
                                <span>{details?.addressInfo?.notes}</span>
                            </div>
                        </div>
                    </div>
                <div>
                    <CommonForm
                        formControls={[
                            {
                                label: "Order Status",
                                name: "status",
                                componentType: "select",
                                options: [
                                    { id: "Processing", label: "Processing"},
                                    { id: "Shipped", label: "Shipped" },
                                    { id: "Delivered", label: "Delivered" },
                                    { id: "Cancelled", label: "Cancelled" },
                                    { id: "Rejected", label: "Rejected" },
                                ],
                            },
                        ]}
                        formData={formData}
                        setFormData={setFormData}
                        buttonText={'Update Order Status'}
                        onSubmit={handleOrderStatus}
                    />
                </div>
                </div>
        </DialogContent>
    );
}

export default AdminOrderDetails;