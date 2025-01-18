import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    cartItems: [],
    isLoading: false,
};

export const addToCart = createAsyncThunk(
    "/cart/addToCart",
    async ({ userId, productId, quantity }) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
            {
                userId,
                productId,
                quantity,
            }
        );
        return response.data;
    }
);

export const fetchCartItems = createAsyncThunk(
    "/cart/fetchCartItems",
    async (userId) => {
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`
        );
        return response.data;
    }
);

export const updateCartItemQty = createAsyncThunk(
    "/cart/updateCartItemQty",
    async ({ userId, productId, quantity }) => {
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
            {
                userId,
                productId,
                quantity,
            }
        );
        return response.data;
    }
);

export const deleteCartItem = createAsyncThunk(
    "/cart/deleteCartItem",
    async ({userId, productId}) => {
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/shop/cart/${userId}/${productId}`
        );
        return response.data;
    }
);

export const mergeCarts = createAsyncThunk(
    "cart/mergeCarts",
    async ({userId, guestCart}) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/shop/cart/merge`,
            { userId, guestCart },
            { withCredentials: true } // Ensure the cookie is included
        );
        return response.data;
    }
);

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // addToCart
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(addToCart.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            // fetchCartItems
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(fetchCartItems.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            // updateCartItemQty
            .addCase(updateCartItemQty.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartItemQty.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(updateCartItemQty.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            // deleteCartItem
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(deleteCartItem.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            });

        // Handle mergeCarts
        builder.addCase(mergeCarts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(mergeCarts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data;
        });
        builder.addCase(mergeCarts.rejected, (state, action) => {
            state.isLoading = false;
            state.cartItems = [];
        });
    },
});



export default shoppingCartSlice.reducer;