import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturn() {

    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search); //get paypal params from url.
    const token = params.get('token');
    const payerId = params.get('PayerID');

    useEffect(()=>{
        if(payerId) {
            const orderId = JSON.parse(sessionStorage.getItem('currentOrderID'));
            dispatch(capturePayment({payerId, paymentId: token, orderId})).then(data=>{
                if(data?.payload?.success) {
                    sessionStorage.removeItem('currentOrderID');
                    window.location.href = '/shop/payment-success'
                }
            })
        }
    }, [payerId, token, dispatch])

    return ( 
        <Card>
            <CardHeader>
                <CardTitle>Your payment is being processed... Please wait!</CardTitle>
            </CardHeader>
        </Card>
     );
}

export default PaypalReturn;