import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  signupAPI,
  requestLoginOTPAPI,
  verifyOTPAPI,
  getMeAPI,
  resendOTPAPI,
  updateAdminCredentialsAPI,
} from '../../services/auth.service';
import { User, SignupInput } from '../../types/user';
import Cookies from 'js-cookie';
import apiClient from '../../services/apiClient';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  hydrated: boolean; // To track if we've attempted to load user on app start
  error: string | null;
  otpSent: boolean;
  verificationPhone: string | null; // Phone number to verify
}

const initialState: AuthState = {
  user: null,
  token:
    typeof window !== 'undefined' ? Cookies.get('auth-token') || null : null,
  isAuthenticated: false,
  loading: false,
  hydrated: false,
  error: null,
  otpSent: false,
  verificationPhone: null,
};

// Async Thunks
export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (input: SignupInput, { rejectWithValue }) => {
    try {
      const response = await signupAPI(input);
      if (!response) throw new Error('No response from server');
      return { user: response.data.data.signup.user, input };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginStartThunk = createAsyncThunk(
  'auth/loginStart',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await requestLoginOTPAPI(phoneNumber);
      if (!response) throw new Error('No response from server');
      return phoneNumber;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Login failed');
    }
  }
);

export const verifyOTPThunk = createAsyncThunk(
  'auth/verifyOTP',
  async (
    { phoneNumber, otp }: { phoneNumber: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await verifyOTPAPI(phoneNumber, otp);
      if (!response) throw new Error('No response from server');
      return response.data.data.verifyOTP;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Verification failed');
    }
  }
);

export const loadUserThunk = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMeAPI();
      if (!response) throw new Error('No response from server');
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to load user');
    }
  }
);

export const resendOTPThunk = createAsyncThunk(
  'auth/resendOTP',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      await resendOTPAPI(phoneNumber);
      return phoneNumber;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to resend OTP'
      );
    }
  }
);

export const signupWithPasswordThunk = createAsyncThunk(
  'auth/signupWithPassword',
  async (
    { phoneNumber, password }: { phoneNumber: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiClient.post('/graphql', {
        query: `
          mutation SignupWithPassword($input: SignupWithPasswordInput!) {
            signupWithPassword(input: $input) {
              token
              user {
                id
                phoneNumber
              }
            }
          }
        `,
        variables: {
          input: { phoneNumber, password },
        },
      });

      const data = res.data.data.signupWithPassword;

      Cookies.set('auth-token', data.token, {
        expires: 7,
        secure: true,
        sameSite: 'None',
        domain: '.rashksastabazaar.com',
      });

      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.errors?.[0]?.message || 'Signup failed'
      );
    }
  }
);
export const loginWithPasswordThunk = createAsyncThunk(
  'auth/loginWithPassword',
  async (
    { phoneNumber, password }: { phoneNumber: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await apiClient.post('/graphql', {
        query: `
          mutation LoginWithPassword($input: LoginPasswordInput!) {
            loginWithPassword(input: $input) {
              token
              user {
                id
                phoneNumber
                role
              }
            }
          }
        `,
        variables: {
          input: { phoneNumber, password },
        },
      });

      const data = res.data.data.loginWithPassword;

      // ✅ store token in cookie (same as OTP flow)
      Cookies.set('auth-token', data.token, {
        expires: 7,
        secure: true,
        sameSite: 'None',
        domain: '.rashksastabazaar.com',
      });

      // ✅ update redux properly
      dispatch(setUser(data));

      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.errors?.[0]?.message || 'Login failed'
      );
    }
  }
);
// Update User
export const updateUserThunk = createAsyncThunk(
  'auth/updateUser',
  async (input: { username?: string; email?: string }, { rejectWithValue }) => {
    try {
      const response = await updateAdminCredentialsAPI(input);
      if (!response) throw new Error('No response from server');
      return response.data.data.updateAdminCredentials;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update user'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.verificationPhone = null;
      Cookies.remove('auth-token');
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder.addCase(signupThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.otpSent = true;
      state.verificationPhone = action.payload.input.phoneNumber;
    });
    builder.addCase(signupThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login Start
    builder.addCase(loginStartThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginStartThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.otpSent = true;
      state.verificationPhone = action.payload;
    });
    builder.addCase(loginStartThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Verify OTP
    builder.addCase(verifyOTPThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOTPThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.otpSent = false;
      state.verificationPhone = null;
      Cookies.set('auth-token', action.payload.token, {
        expires: 7,
        secure: true,
        sameSite: 'None',
        domain: '.rashksastabazaar.com',
      });
    });
    builder.addCase(verifyOTPThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Load User
    builder.addCase(loadUserThunk.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.token = Cookies.get('auth-token') || null;
      state.isAuthenticated = true;
      state.hydrated = true;
    });

    builder.addCase(loadUserThunk.rejected, (state) => {
      state.loading = false;
      state.hydrated = true;
      state.user = null;
      state.isAuthenticated = false;
    });

    // Update User
    builder.addCase(updateUserThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.user = action.payload;
      }
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, resetError, setUser } = authSlice.actions;
export default authSlice.reducer;
