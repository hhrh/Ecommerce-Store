import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios";

const initialState = {
    isLoading: false,
    addressList: [],
}

export const addAddress = createAsyncThunk(
    '/address/addAddress',
    async (formData) =>{
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/shop/address/add`,
            formData
        );
        return response?.data
    }
)

export const fetchAllAddresses = createAsyncThunk(
    "/address/fetchAllAddresses",
    async (userId) => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/address/get/${userId}`
        );
        return response?.data;
    }
);

export const editAddress = createAsyncThunk(
    "/address/editAddress",
    async ({userId, addressId, formData}) => {
    const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shop/address/update/${userId}/${addressId}`,
        formData
    );
    return response?.data;
});

export const deleteAddress = createAsyncThunk(
    "/address/deleteAddress",
    async ({userId, addressId}) => {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/shop/address/delete/${userId}/${addressId}`
        );
        return response?.data;
    }
);

const addressSlice = createSlice({
    name: 'addressSlice',
    initialState,
    reducers: {},
    extraReducers: builder=>{
        builder
            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.isLoading = true;
            })
            .addCase(addAddress.rejected, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllAddresses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllAddresses.fulfilled, (state, action) => {
                state.isLoading = true;
                state.addressList = action.payload.data;
            })
            .addCase(fetchAllAddresses.rejected, (state) => {
                state.isLoading = true;
                state.addressList = [];
            });
    }
})

export default addressSlice.reducer;