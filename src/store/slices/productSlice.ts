// productsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types/product';
import products from '@/data/products';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: products,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Product CRUD operations
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },

    deleteProduct: (state, action: PayloadAction<string | number>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },

    // Utility actions
    clearProducts: (state) => {
      state.products = [];
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  clearProducts,
  clearError,
} = productsSlice.actions;

// Export reducer
export default productsSlice.reducer;
