import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    orders: [],
    orderDetails: null,
};

export const getAllUserOrders = createAsyncThunk(
    "/order/getAllUserOrders",
    async () => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin/orders/get/`
        );
        return response.data;
    }
);

export const getOrderDetailsAdmin = createAsyncThunk(
    "/order/getOrderDetailsAdmin",
    async (id) => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`
        );
        return response.data;
    }
);

export const updateOrderStatus = createAsyncThunk(
    "/order/updateOrderStatus",
    async ({ id, orderStatus }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
            {
                orderStatus,
            }
        );
        return response.data;
    }
);

const adminOrderSlice = createSlice({
    name: 'adminOrderSlice',
    initialState,
    reducers: {},
    extraReducers: builder=>{
        builder
            .addCase(getAllUserOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllUserOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.data;
            })
            .addCase(getAllUserOrders.rejected, (state) => {
                state.isLoading = true;
                state.orders = [];
            })
            .addCase(getOrderDetailsAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetailsAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
            })
            .addCase(getOrderDetailsAdmin.rejected, (state) => {
                state.isLoading = true;
                state.orderDetails = null;
            });
    }
})

export default adminOrderSlice.reducer;