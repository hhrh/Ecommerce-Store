import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    results: [],
}

export const getSearchResults = createAsyncThunk(
    "/products/getSearchResults",
    async (keyword) => {
        const result = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/search/${keyword}`
        );
        return result?.data;
    }
);

const searchSlice = createSlice({
    name: "searchSlice",
    initialState,
    reducers: {
        clearSearchResults: (state)=>{
            state.results=[]
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSearchResults.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSearchResults.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload.data;
            })
            .addCase(getSearchResults.rejected, (state) => {
                state.isLoading = false;
                state.results = [];
            });
    },
});
export const {clearSearchResults} = searchSlice.actions;
export default searchSlice.reducer;