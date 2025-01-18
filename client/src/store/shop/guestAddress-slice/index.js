import { createSlice } from "@reduxjs/toolkit";

const loadAddressesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("guestAddresses")) || [];
};

const saveAddressesToLocalStorage = (addresses) => {
    localStorage.setItem("guestAddresses", JSON.stringify(addresses));
};

const guestAddressSlice = createSlice({
    name: "guestAddress",
    initialState: {
        addresses: loadAddressesFromLocalStorage(),
    },
    reducers: {
        // Add a new address
        guestAddAddress(state, action) {
            const newAddress = action.payload;
            state.addresses.push(newAddress);
            saveAddressesToLocalStorage(state.addresses);
        },
        // Edit an existing address
        guestEditAddress(state, action) {
            const { id, updatedAddress } = action.payload;
            const index = state.addresses.findIndex((addr) => addr._id === id);
            if (index !== -1) {
                state.addresses[index] = { ...state.addresses[index], ...updatedAddress };
                saveAddressesToLocalStorage(state.addresses);
            }
        },
        // Delete an address
        guestDeleteAddress(state, action) {
            const id = action.payload;
            state.addresses = state.addresses.filter((addr) => addr._id !== id);
            saveAddressesToLocalStorage(state.addresses);
        },
        // Clear all addresses (e.g., for resetting the guest checkout)
        guestClearAddresses(state) {
            state.addresses = [];
            saveAddressesToLocalStorage(state.addresses);
        },
    },
});

export const { guestAddAddress, guestEditAddress, guestDeleteAddress, guestClearAddresses } = guestAddressSlice.actions;
export default guestAddressSlice.reducer;