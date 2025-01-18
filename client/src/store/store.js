import { configureStore } from "@reduxjs/toolkit"
import authReducer from './auth-slice'
import adminProductsSlice from './admin/products-slice'
import adminOrderSlice from "./admin/order-slice";
import shopListingSlice from './shop/listing-slice'
import shoppingCartSlice from './shop/cart-slice'
import shoppingGuestCartSlice from './shop/guestCart-slice'
import shopAddressSlice from './shop/address-slice'
import orderSlice from './shop/order-slice'
import searchSlice from './shop/search-slice'
import reviewsSlice from './shop/reviews-slice'
import guestAddressReducer from './shop/guestAddress-slice'
import featureSlice from './common/feature-slice/index.js'

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProducts: adminProductsSlice,
        adminOrders: adminOrderSlice,
        shopListings: shopListingSlice,
        cart: shoppingCartSlice,
        shopAddress: shopAddressSlice,
        guestCartItems: shoppingGuestCartSlice,
        order: orderSlice,
        search: searchSlice,
        reviews: reviewsSlice,
        guestAddress: guestAddressReducer,
        featuredImages: featureSlice
    },
});

export default store;