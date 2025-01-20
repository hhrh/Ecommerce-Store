import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, deleteAddress, editAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import AddressTile from "./address-tile";
import { useToast } from "@/hooks/use-toast";
import { guestAddAddress, guestDeleteAddress, guestEditAddress } from "@/store/shop/guestAddress-slice";

const initialAddressData = {
    firstName: '',
    lastName: '',
    address: '',
    aptSuite: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    phone: '',
    notes: '',
}

function Address({ setSelectedAddress, selectedId }) {
    const [formData, setFormData] = useState(initialAddressData);
    const [IdToEdit, setIdToEdit] = useState(null);
    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.auth);
    const {addressList} = useSelector(state=>state.shopAddress);
    const guestAddressList = useSelector(state => state.guestAddress);
    const {toast} = useToast();

    const selectAddressList = user ? addressList : guestAddressList.addresses;

    function handleSubmitAddress(event) {
        event.preventDefault();

        if (selectAddressList && selectAddressList.length >= 3 && IdToEdit === null) {
            toast({
                title: "You can only add 3 addresses maximum.",
                variant: 'destructive'
            })
            setFormData(initialAddressData);
            return;
        }

        if (IdToEdit) {
            if(!user) {
                dispatch(guestEditAddress({id: IdToEdit, updatedAddress: formData}))
                setIdToEdit(null);
                setFormData(initialAddressData);
                toast({
                    title: "Address edited successfully."
                })
                return;
            }
            dispatch(editAddress({ userId: user?.id, addressId: IdToEdit, formData })
            ).then(data => {
                if (data?.payload?.success) {
                    toast({
                        title: "Address edited successfully."
                    })
                    dispatch(fetchAllAddresses(user?.id));
                    setIdToEdit(null);
                    setFormData(initialAddressData);
                }
            })
        } else {
            if(!user) {
                dispatch(guestAddAddress({ _id: Date.now(), ...formData}));
                dispatch(fetchAllAddresses(user?.id));
                setFormData(initialAddressData);
                return;
            }
            dispatch(addAddress({
                ...formData,
                userId: user?.id
            })).then(data=>{
                if(data.payload.success) {
                    dispatch(fetchAllAddresses(user?.id))
                    setFormData(initialAddressData)
                }
            })
        }
    }
    function handleDeleteAddress(info) {
        if(!user) {
            dispatch(guestDeleteAddress(info.id));
            toast({
                title: "Address deleted successfully."
            })
            dispatch(fetchAllAddresses(user?.id));
            return;
        }
        dispatch(deleteAddress({userId: user?.id, addressId: info?._id})
        ).then(data=>{
            if(data?.payload?.success) {
                toast({
                    title: "Address deleted successfully."
                })
                dispatch(fetchAllAddresses(user?.id));
            }
        })
    }
    function handleEditAddress(info) {
        user ? setIdToEdit(info?._id) : setIdToEdit(info?.id);
        setFormData({
            ...formData,
            firstName: info?.firstName,
            lastName: info?.lastName,
            address: info?.address,
            aptSuite: info?.aptSuite || '',
            city: info?.city,
            state: info?.state,
            country: info?.country,
            phone: info?.phone,
            zipcode: info?.zipcode,
            notes: info?.notes || '',
        })
    }

    function validateForm() {
        const optionalFields = ['aptSuite', 'notes']; //list of optional keys
        return Object.keys(formData)
            .filter(key => !optionalFields.includes(key)) 
            .map(key => formData[key].trim() !== '')
            .every(item => item);
    }

    useEffect(()=>{
        dispatch(fetchAllAddresses(user?.id))
    },[dispatch])

    return (
        <Card className="grid grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))] gap-4">
            <div className="flex flex-col m-4">
                {selectAddressList && selectAddressList.length > 0
                    ? selectAddressList.map((info) => (
                            <AddressTile info={info} key={info._id} 
                            handleEditAddress={handleEditAddress}
                            handleDeleteAddress={handleDeleteAddress}
                            setSelectedAddress={setSelectedAddress}
                            selectedId={selectedId}/>
                      ))
                    : null}
            </div>
            <div>
            <CardHeader>
                <CardTitle>
                      {
                        IdToEdit === null ? "Add new address" : "Edit existing address"
                      }
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CommonForm
                    formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={IdToEdit === null ? "Add" : "Edit"}
                    onSubmit={handleSubmitAddress}
                    isBtnDisabled={!validateForm()}
                />
            </CardContent>
            </div>
        </Card>
    );
}

export default Address;