import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import UserOrderDetails from "./order-details";
import { useEffect, useState } from "react";
import { getAllOrdersByUser, getOrderDetails } from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function UserOrders() {
    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.auth);
    const {userOrders, orderDetails} = useSelector(state=>state.order);

    function handleGetOrderDetails(id) {
        dispatch(getOrderDetails(id))
    }
    
    useEffect(()=>{
        dispatch(getAllOrdersByUser(user?.id))
    }, [dispatch])

    console.log(orderDetails, "orderDetails");
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
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
                            userOrders && userOrders.length > 0
                            ? userOrders.map(order=>
                                <TableRow key={order._id}>
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
                                                <Button onClick={()=>handleGetOrderDetails(order?._id)}>View Details</Button>
                                            </DialogTrigger>
                                            <UserOrderDetails details={orderDetails}/>
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

export default UserOrders;