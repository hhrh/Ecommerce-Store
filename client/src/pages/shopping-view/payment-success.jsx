import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
    const navigate = useNavigate();
    return ( 
        <div className="w-full p-4 md:p-8">
            <div className="bg-primary-foreground rounded-md p-4 shadow-md">
                <div className="mb-3">
                    <p className="text-xl">Payment Successful!</p>
                </div>
                <Button onClick={()=>navigate('/shop/account')}>
                    View Orders
                </Button>
            </div>
        </div>
    );
}

export default PaymentSuccess;