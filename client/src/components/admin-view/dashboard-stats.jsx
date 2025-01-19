import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect } from "react";
import { getUserCount } from "@/store/admin/users-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllUserOrders } from "@/store/admin/order-slice";

function DashboardStats() {
    const { productList } = useSelector(state => state.adminProducts);
    const { orders } = useSelector(state => state.adminOrders);
    const { userCount } = useSelector(state => state.adminUsers);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(getUserCount());
        dispatch(fetchAllProducts());
        dispatch(getAllUserOrders());
    }, [dispatch])

    return ( 
        <div>
            <div className="grid gap-4 grid-cols-3 m-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl">{userCount}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl">{productList.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl">{orders.length}</p>
                    </CardContent>
                </Card>
        </div>
        </div>
    );
}

export default DashboardStats;