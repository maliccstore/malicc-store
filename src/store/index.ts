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
import checkoutReducer from './slices/checkoutSlice';
import adminDashboard from './admin/dashboard/dashboardSlice';
import { loadState, saveState } from './cartPersist';

export const makeStore = () => {
  const persistedState = loadState();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = persistedState as any;
  const preloadedState = persistedState ? {
    // Support old format (cart stored directly with `items`) and new format ({cart, checkout})
    cart: raw?.cart ?? (raw?.items ? raw : undefined),
    checkout: raw?.checkout ?? undefined,
  } : undefined;


  const store = configureStore({
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
      checkout: checkoutReducer,
      adminDashboard: adminDashboard,
      // Add other reducers here
    },
    // Cast to undefined so TS doesn't constrain the reducer shape to the partial persisted state
    preloadedState: preloadedState as undefined,
  });

  // Subscribe to store changes to persist cart and checkout state
  store.subscribe(() => {
    saveState(store.getState());
  });

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the RootState and AppDispatch types
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
