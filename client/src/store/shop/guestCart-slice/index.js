import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("guestCart")) || { items: [] };
};

const saveCartToLocalStorage = (cart) => {
    localStorage.setItem("guestCart", JSON.stringify(cart));
};



const guestCartSlice = createSlice({
    name: "guestCart",
    initialState: loadCartFromLocalStorage(),
    reducers: {
        guestAddItem(state, action) {
            const { productId, quantity } = action.payload;
            const existingItem = state.items.find(
                (item) => item.productId === productId
            );
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ productId, quantity });
            }
            saveCartToLocalStorage(state);
        },
        guestUpdateQty(state, action) {
            const { productId, quantity } = action.payload;
            const existingItem = state.items.find(
                (item) => item.productId === productId
            );
            if (existingItem) {
                existingItem.quantity = quantity;
            }
            saveCartToLocalStorage(state);
        },
        guestRemoveItem(state, action) {
            const productId = action.payload;
            state.items = state.items.filter(
                (item) => item.productId !== productId
            );
            saveCartToLocalStorage(state);
        },
        guestClearCart(state) {
            state.items = [];
            saveCartToLocalStorage(state);
        },
    },
});

export const {
    guestAddItem,
    guestUpdateQty,
    guestRemoveItem,
    guestClearCart 
} = guestCartSlice.actions;
export default guestCartSlice.reducer;
