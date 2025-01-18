import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    Listings: [],
    ListingDetails: null,
};

export const fetchAllListings = createAsyncThunk(
    "/products/fetchAllListings",
    async ({ filterParams, sortParams }) => {
        //create a query
        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortParams,
        });

        const result = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`
        );
        return result?.data;
    }
);

export const fetchListingDetails = createAsyncThunk(
    "/products/fetchListingDetails",
    async (id) => {

        const result = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/products/get/${id}`
        );
        return result?.data;
    }
);

const shopListingSlice = createSlice({
    name: "shopListings",
    initialState,
    reducers: {
        setListingDetails: (state)=>{
            state.ListingDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllListings.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchAllListings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.Listings = action.payload.data;
            })
            .addCase(fetchAllListings.rejected, (state, action) => {
                state.isLoading = false;
                state.Listings = [];
            })
            .addCase(fetchListingDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchListingDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ListingDetails = action.payload.data;
            })
            .addCase(fetchListingDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.ListingDetails = null;
            });
    },
});

export const {setListingDetails} = shopListingSlice.actions;

export default shopListingSlice.reducer;
