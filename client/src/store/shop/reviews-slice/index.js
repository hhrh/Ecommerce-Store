import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState= {
    isLoading: false,
    reviews: []
}

export const addProductReview = createAsyncThunk(
    '/reviews/add',
    async (reviewData) =>{
        console.log(reviewData, 'hey')
        await axios.post(
            `${import.meta.env.VITE_API_URL}/api/shop/reviews/add`,
            reviewData
        );
        return response.data;
    }
)
export const getProductReviews= createAsyncThunk(
    '/reviews/get',
    async (productId) =>{
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shop/reviews/${productId}`
        );
        return response.data;
    }
)

const reviewsSlice = createSlice({
    name: 'reviewsSlice',
    initialState,
    reducer: {},
    extraReducers: builder=>{
        builder.addCase(getProductReviews.pending, (state)=>{
            state.isLoading=false;
        }).addCase(getProductReviews.fulfilled, (state, action)=>{
            state.isLoading=false;
            state.reviews=action.payload.data;
        }).addCase(getProductReviews.rejected, (state)=>{
            state.isLoading=false;
            state.reviews=[];
        })
    }
})

export default reviewsSlice.reducer;