import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

function UserOrderDetails({ details }) {
    const { user } = useSelector(state => state.auth);

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
                            <Badge className={`py-1 px-3 ${details?.orderStatus === 'Delivered'
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
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="font-bold">
                                Shipping info
                            </div>
                            <div className="grid gap-0.5 text-muted-foreground">
                                <span>{user?.userName}</span>
                                <span>{details?.addressInfo.phone}</span>
                                <span>{details?.addressInfo.address}</span>
                                <span>{details?.addressInfo.city}</span>
                                <span>{details?.addressInfo.zipcode}</span>
                                <span>{details?.addressInfo.notes}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">

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
        </DialogContent>
    );
}

export default UserOrderDetails;