import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetails from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllUserOrders, getOrderDetailsAdmin } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersCard() {
    const { orders, orderDetails } = useSelector(state => state.adminOrders);
    const dispatch = useDispatch();

    function handleGetOrderDetails(id) {
        dispatch(getOrderDetailsAdmin(id));
        console.log(orderDetails, "GET DEEZ DETAILS MANE");
    }

    useEffect(()=>{
        dispatch(getAllUserOrders())
    }, [dispatch])

    console.log(orderDetails, "GET DEEZ DETAILS MANEEEEE");

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Id</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            orders && orders.length > 0
                                ? orders.map(order =>
                                    <TableRow>
                                        <TableCell>{order?._id}</TableCell>
                                        <TableCell>{order?.orderDate?.split('T')[0]}</TableCell>
                                        <TableCell>
                                            <Badge className={`py-1 px-3 ${order?.orderStatus === 'Delivered'
                                                    ? "bg-green-500 hover:bg-green-400"
                                                    : (order?.orderStatus === 'Cancelled'
                                                        || order?.orderStatus === 'Rejected')
                                                        ? "bg-red-500 hover:bg-red-400"
                                                        : "bg-slate-500 hover:bg-slate-400"
                                                }`}>
                                                {order?.orderStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>${order?.totalAmount}</TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button onClick={() => handleGetOrderDetails(order?._id)}>View Details</Button>
                                                </DialogTrigger>
                                                <AdminOrderDetails details={orderDetails} />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                )
                                : null
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default AdminOrdersCard;