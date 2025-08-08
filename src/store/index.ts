import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      cart: cartReducer,
      products: productReducer,
      // Add other reducers here
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the RootState and AppDispatch types
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
