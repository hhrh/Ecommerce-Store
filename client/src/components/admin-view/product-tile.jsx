import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({product, setFormData, setOpenCreateProducts, setCurrentEditedId, handleDelete}) {
    console.log(product)
    return (
        <Card className="w-full max-w-sm mx-auto m-3 h-min">
            <div>
                <div className="relative">
                    <img
                    src={product?.images[0]?.secure_url}
                    alt={product?.title}
                    className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                </div>
                <CardContent>
                    <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`${product?.salePrice > 0 ? 'line-through' : ''} text-lg font-semibold text-primary`}>${product?.price}</span>
                        {
                            product?.salePrice > 0 ? <span className="text-lg font-bold">${product?.salePrice}</span> : null
                        }
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4">
                    <Button onClick={()=>{
                        setOpenCreateProducts(true);
                        setCurrentEditedId(product?._id);
                        setFormData(product);
                    }}>Edit</Button>
                    <Button variant="destructive" onClick={(()=>handleDelete(product?._id))}>Delete</Button>
                </CardFooter>
            </div>
        </Card>
    );
}

export default AdminProductTile;