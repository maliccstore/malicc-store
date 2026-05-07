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
  hydrated: boolean;
  error: string | null;
  otpSent: boolean;
  verificationPhone: string | null;
}

const COOKIE_NAME = 'auth-token';

const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    expires: 7,
    secure: isProd,
    sameSite: 'None' as const,
    ...(isProd && {
      domain: '.rashksastabazaar.com',
    }),
  };
};

const setAuthCookie = (token: string) => {
  Cookies.set(COOKIE_NAME, token, getCookieOptions());
};

const removeAuthCookie = () => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    Cookies.remove(COOKIE_NAME, {
      domain: '.rashksastabazaar.com',
    });
  }

  Cookies.remove(COOKIE_NAME);
};

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;

  return Cookies.get(COOKIE_NAME) || null;
};

const initialState: AuthState = {
  user: null,
  token: getStoredToken(),
  isAuthenticated: false,
  loading: false,
  hydrated: false,
  error: null,
  otpSent: false,
  verificationPhone: null,
};

// ========================
// AUTH THUNKS
// ========================

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (input: SignupInput, { rejectWithValue }) => {
    try {
      const response = await signupAPI(input);

      if (!response) {
        throw new Error('No response from server');
      }

      return {
        user: response.data.data.signup.user,
        input,
      };
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Signup failed'
      );
    }
  }
);

export const loginStartThunk = createAsyncThunk(
  'auth/loginStart',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await requestLoginOTPAPI(phoneNumber);

      if (!response) {
        throw new Error('No response from server');
      }

      return phoneNumber;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Login failed'
      );
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

      if (!response) {
        throw new Error('No response from server');
      }

      const data = response.data.data.verifyOTP;

      setAuthCookie(data.token);

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Verification failed'
      );
    }
  }
);

export const loadUserThunk = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = getStoredToken();

      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await getMeAPI();

      if (!response) {
        throw new Error('No response from server');
      }

      return {
        user: response.data.data.user,
        token,
      };
    } catch (error: any) {
      removeAuthCookie();

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to load user'
      );
    }
  }
);

export const resendOTPThunk = createAsyncThunk(
  'auth/resendOTP',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      await resendOTPAPI(phoneNumber);

      return phoneNumber;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to resend OTP'
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

      setAuthCookie(data.token);

      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.errors?.[0]?.message || 'Signup failed'
      );
    }
  }
);

export const loginWithPasswordThunk = createAsyncThunk(
  'auth/loginWithPassword',
  async (
    { phoneNumber, password }: { phoneNumber: string; password: string },
    { rejectWithValue }
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

      setAuthCookie(data.token);

      return data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.errors?.[0]?.message || 'Login failed'
      );
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'auth/updateUser',
  async (input: { username?: string; email?: string }, { rejectWithValue }) => {
    try {
      const response = await updateAdminCredentialsAPI(input);

      if (!response) {
        throw new Error('No response from server');
      }

      return response.data.data.updateAdminCredentials;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to update user'
      );
    }
  }
);

// ========================
// SLICE
// ========================

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logout: (state) => {
      removeAuthCookie();

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.otpSent = false;
      state.verificationPhone = null;
      state.hydrated = true;
    },

    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.hydrated = true;
      state.error = null;
    },

    resetError: (state) => {
      state.error = null;
    },

    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.otpSent = false;
    },
    markHydrated: (state) => {
      state.hydrated = true;
    },
  },

  extraReducers: (builder) => {
    // ========================
    // SIGNUP
    // ========================

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

    // ========================
    // LOGIN START
    // ========================

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

    // ========================
    // VERIFY OTP
    // ========================

    builder.addCase(verifyOTPThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(verifyOTPThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.hydrated = true;
      state.error = null;
      state.otpSent = false;
      state.verificationPhone = null;
    });

    builder.addCase(verifyOTPThunk.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    // ========================
    // LOAD USER
    // ========================

    builder.addCase(loadUserThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loadUserThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.hydrated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    });

    builder.addCase(loadUserThunk.rejected, (state, action) => {
      removeAuthCookie();

      state.loading = false;
      state.hydrated = true;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    // ========================
    // RESEND OTP
    // ========================

    builder.addCase(resendOTPThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(resendOTPThunk.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(resendOTPThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // SIGNUP WITH PASSWORD
    // ========================

    builder.addCase(signupWithPasswordThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(signupWithPasswordThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.hydrated = true;
    });

    builder.addCase(signupWithPasswordThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ========================
    // LOGIN WITH PASSWORD
    // ========================

    builder.addCase(loginWithPasswordThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loginWithPasswordThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.hydrated = true;
      state.error = null;
    });

    builder.addCase(loginWithPasswordThunk.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    // ========================
    // UPDATE USER
    // ========================

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

export const { logout, resetError, setUser, resetAuthState, markHydrated } =
  authSlice.actions;

export default authSlice.reducer;
