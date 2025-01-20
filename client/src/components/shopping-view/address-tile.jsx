import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AddressTile({ info, handleEditAddress, handleDeleteAddress, setSelectedAddress, selectedId }) {
    const { user } = useSelector(state => state.auth);

    const fields = [
        { label: "Name", value: `${info?.firstName} ${info?.lastName}` },
        { label: "Address", value: info?.address },
        { label: "Apt, Suite, etc.", value: info?.aptSuite, optional: true },
        { label: "City", value: info?.city },
        { label: "State", value: info?.state },
        { label: "Country", value: info?.country },
        { label: "Zip Code", value: info?.zipcode },
        { label: "Phone", value: info?.phone },
        { label: "Notes", value: info?.notes, optional: true },
    ];
    return ( 
        <Card onClick={setSelectedAddress ? () => setSelectedAddress(info) : null}
            className={`m-2 shadow-md cursor-pointer ${(user && selectedId === info?._id) || (!user && selectedId === info?.id) ? 'bg-blue-300' : 'hover:bg-blue-300/50 transition-colors'}`}>
            <CardContent className='p-4 grid gap-4 rounded-lg'>
                <div className='p-4 bg-primary-foreground border rounded-lg shadow-inner'>
                    {fields.map((field, index) => (
                        (field.value || !field.optional) && (
                            <div
                                key={index}
                                className="mb-2 text-gray-700 flex items-start justify-between"
                            >
                                <span className="font-bold">{field.label}:</span>
                                <span className="ml-2">{field.value}</span>
                            </div>
                        )
                    ))}
                </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-between">
                <Button onClick={()=>handleEditAddress(info)}>Edit</Button>
                <Button variant="destructive" onClick={()=>handleDeleteAddress(info)}>Delete</Button>
            </CardFooter>
        </Card>
    );
}

export default AddressTile;