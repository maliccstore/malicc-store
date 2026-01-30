import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import cartReducer from './slices/cartSlice';
import healthReducer from './slices/healthSlice';
import productReducer from './slices/productSlice';
// store/index.ts
import adminProducts from './admin/product/productSlice';
import adminOrders from './admin/order/orderSlice';
import adminUsers from './admin/users/usersSlice';
import authReducer from './slices/authSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';
import { loadState, saveState } from './cartPersist';
const preloadedState = {
  cart: loadState() || undefined,
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      cart: cartReducer,
      products: productReducer,
      health: healthReducer,
      adminProducts: adminProducts,
      adminOrders: adminOrders,
      adminUsers: adminUsers,
      auth: authReducer,
      wishlist: wishlistReducer,
      orders: orderReducer,
      // Add other reducers here
    },
    preloadedState,
  });
};
const store = makeStore();
store.subscribe(() => {
  saveState(store.getState());
});

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the RootState and AppDispatch types
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
