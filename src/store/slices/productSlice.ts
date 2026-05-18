// productsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, ProductFilterInput } from '@/types/product';
import { StorefrontHomepagePayload } from '@/types/homepage';
import { productService } from '@/services/product.service';

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  homepagePayload: StorefrontHomepagePayload | null;
  homepageLoading: boolean;
  homepageError: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  homepagePayload: null,
  homepageLoading: false,
  homepageError: null,
};

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters: ProductFilterInput | undefined, { rejectWithValue }) => {
    try {
      const products = await productService.fetchProducts(filters);
      return products;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching storefront homepage payload
export const fetchHomepageConfig = createAsyncThunk(
  'products/fetchHomepageConfig',
  async (_, { rejectWithValue }) => {
    try {
      const payload = await productService.getStorefrontHomepage();
      return payload;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch homepage configuration';
      return rejectWithValue(errorMessage);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Utility actions
    clearProducts: (state) => {
      state.products = [];
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Legacy actions kept for compatibility if needed elsewhere temporarily
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHomepageConfig.pending, (state) => {
        state.homepageLoading = true;
        state.homepageError = null;
      })
      .addCase(fetchHomepageConfig.fulfilled, (state, action) => {
        state.homepageLoading = false;
        state.homepagePayload = action.payload;
        state.homepageError = null;
      })
      .addCase(fetchHomepageConfig.rejected, (state, action) => {
        state.homepageLoading = false;
        state.homepageError = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearProducts,
  clearError,
  setProducts,
} = productsSlice.actions;

// Export reducer
export default productsSlice.reducer;
