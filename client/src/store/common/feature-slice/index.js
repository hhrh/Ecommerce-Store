import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    imageList: [],
};

export const getFeatureImages = createAsyncThunk(
    "/products/getFeatureImages",
    async () => {
        const result = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/common/feature/get`
        );
        return result?.data;
    }
);

export const addFeatureImage = createAsyncThunk(
    "/products/addFeatureImage",
    async (data) => {
        const result = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/common/feature/add`,
            data
        );
        return result?.data;
    }
);

export const deleteFeatureImage = createAsyncThunk(
    "/products/deleteFeatureImage",
    async (id) => {
        const result = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/common/feature/delete/${id}`
        );
        return result?.data;
    }
);

const featureSlice = createSlice({
    name: "featureSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFeatureImages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFeatureImages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.imageList = action.payload.data;
            })
            .addCase(getFeatureImages.rejected, (state) => {
                state.isLoading = false;
                state.imageList = [];
            });
    },
});
export default featureSlice.reducer;