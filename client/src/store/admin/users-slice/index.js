import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    userCount: null,
};

export const getUserCount = createAsyncThunk(
    "/users/getUserCount",
    async () => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/admin/users/user-count`
        );
        return response.data;
    }
);

const adminUsersSlice = createSlice({
    name: "adminUsersSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserCount.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUserCount.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userCount = action.payload.count;
            })
            .addCase(getUserCount.rejected, (state) => {
                state.isLoading = true;
                state.userCount = null;
            })
    },
});

export default adminUsersSlice.reducer;
