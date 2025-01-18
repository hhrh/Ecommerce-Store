import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    payerActionUrl: null,
    isLoading: false,
    orderId: null,
    userOrders: [],
    orderDetails: null,
}

export const createOrder = createAsyncThunk('/order/createOrder',
    async(orderData)=>{
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/shop/order/create`,
            orderData
        );
        return response.data;
    }
)

export const capturePayment = createAsyncThunk(
    "/order/capturePayment",
    async ({ orderId, paymentId, payerId }) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/shop/order/capture`,
            { orderId, paymentId, payerId }
        );
        return response.data;
    }
);

export const getAllOrdersByUser = createAsyncThunk(
    "/order/getAllOrdersByUser",
    async (userId) => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`
        );
        return response.data;
    }
);

export const getOrderDetails = createAsyncThunk(
    "/order/getOrderDetails",
    async (id) => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`
        );
        return response.data;
    }
);

const orderSlice = createSlice({
    name: 'orderSlice',
    initialState,
    reducers: {},
    extraReducers: builder=>{
        builder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = true;
                state.payerActionUrl = action.payload.payerActionUrl;
                state.orderId = action.payload.orderId;
                sessionStorage.setItem(
                    "currentOrderID",
                    JSON.stringify(action.payload.orderId)
                );
            })
            .addCase(createOrder.rejected, (state) => {
                state.isLoading = true;
                state.payerActionUrl = null;
                state.orderId = null;
            })
            .addCase(getAllOrdersByUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrdersByUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userOrders = action.payload.data;
            })
            .addCase(getAllOrdersByUser.rejected, (state) => {
                state.isLoading = true;
                state.userOrders = [];
            })
            .addCase(getOrderDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
            })
            .addCase(getOrderDetails.rejected, (state) => {
                state.isLoading = true;
                state.orderDetails = null;
            });
    }
})


export default orderSlice.reducer;