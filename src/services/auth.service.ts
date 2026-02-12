
import apiClient from "./apiClient";
import { SignupInput } from "../types/user";

/**
 * Centralized API error handler
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleApiError = (error: any): never => {
  let errorMessage = "Something went wrong";
  let validationErrors = error?.validationErrors; // Preserve existing validation errors

  // Axios response error
  if (error?.response?.data) {
    const data = error.response.data;

    // GraphQL error
    if (data.errors?.length) {
      const gqlError = data.errors[0];
      errorMessage = gqlError.message;

      // Extract validation errors from extensions
      if (gqlError.extensions?.validationErrors) {
        validationErrors = gqlError.extensions.validationErrors;
      }

    }
    // REST-style error
    else if (data.message) {
      errorMessage = data.message;
    }
  }
  // Network / no response
  else if (error?.request) {
    errorMessage = "No response from server";
  }
  // JS error
  else if (error?.message) {
    errorMessage = error.message;
  }

  // Clean Sequelize noise (Legacy fallback)
  if (errorMessage.includes("SequelizeUniqueConstraintError")) {
    errorMessage = "Username, email, or phone number already exists";
  }

  if (errorMessage.includes("Validation error")) {
    errorMessage = errorMessage.replace("Validation error", "").trim();
  }

  // Throw an object with the message and validation errors
  // We throw a custom object that mimics an Error but carries data
  const errorObj = {
    message: errorMessage,
    validationErrors
  };

  throw errorObj;
};

/**
 * Signup API
 */
export const signupAPI = async (input: SignupInput) => {
  try {
    console.log("signupAPI called with:", input); // DEBUG LOG

    const query = `
      mutation Signup($input: SignupInput!) {
        signup(input: $input) {
          user {
            id
            phoneNumber
            role
            isAdmin
            isPhoneVerified
          }
        }
      }
    `;

    const response = await apiClient.post("", {
      query,
      variables: { input },
    });

    console.log("signupAPI raw response:", response.data); // DEBUG LOG

    const graphQLError = response.data?.errors?.[0];
    if (graphQLError) {
      // console.error("signupAPI GraphQL Error:", JSON.stringify(graphQLError, null, 2)); // DEBUG LOG

      const errorObj = {
        message: graphQLError.message || "Unknown GraphQL Error",
        validationErrors: graphQLError.extensions?.validationErrors
      };
      throw errorObj;
    }

    return response;
  } catch (error) {
    // console.error("signupAPI caught error:", error); // DEBUG LOG
    handleApiError(error);
  }
};

/**
 * Request Login OTP
 */
export const requestLoginOTPAPI = async (phoneNumber: string) => {
  try {
    const query = `
      mutation RequestLoginOTP($phoneNumber: String!) {
        requestLoginOTP(phoneNumber: $phoneNumber)
      }
    `;

    const response = await apiClient.post("", {
      query,
      variables: { phoneNumber },
    });

    const graphQLError = response.data?.errors?.[0];
    if (graphQLError) {
      throw new Error(graphQLError.message);
    }

    return response;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Verify OTP
 */
export const verifyOTPAPI = async (phoneNumber: string, otp: string) => {
  try {
    console.log("verifyOTPAPI called with:", { phoneNumber, otp }); // DEBUG LOG

    const query = `
      mutation VerifyOTP($phoneNumber: String!, $otp: String!) {
        verifyOTP(phoneNumber: $phoneNumber, otp: $otp) {
          token
          user {
            id
            phoneNumber
            role
            isAdmin
            isPhoneVerified
          }
        }
      }
    `;

    const response = await apiClient.post("", {
      query,
      variables: { phoneNumber, otp },
    });

    console.log("verifyOTPAPI raw response:", response.data); // DEBUG LOG

    const graphQLError = response.data?.errors?.[0];
    if (graphQLError) {
      console.error("verifyOTPAPI GraphQL Error:", graphQLError); // DEBUG LOG
      throw new Error(graphQLError.message);
    }

    return response;
  } catch (error) {
    console.error("verifyOTPAPI caught error:", error); // DEBUG LOG
    handleApiError(error);
  }
};

/**
 * Resend OTP
 */
export const resendOTPAPI = async (phoneNumber: string) => {
  try {
    const query = `
      mutation RequestOTP($phoneNumber: String!) {
        RequestOTP(phoneNumber: $phoneNumber)
      }
    `;

    const response = await apiClient.post("", {
      query,
      variables: { phoneNumber },
    });

    const graphQLError = response.data?.errors?.[0];
    if (graphQLError) {
      throw new Error(graphQLError.message);
    }

    return response;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Get Logged-in User
 */
export const getMeAPI = async () => {
  try {
    const query = `
      query Me {
        user {
          id
          phoneNumber
          role
          isAdmin
          isPhoneVerified
        }
      }
    `;

    const response = await apiClient.post("", { query });

    const graphQLError = response.data?.errors?.[0];
    if (graphQLError) {
      throw new Error(graphQLError.message);
    }

    return response;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Update User By Phone
 */
export const updateUserByPhoneAPI = async (input: { username?: string; email?: string }) => {
  try {
    const query = `
      mutation UpdateUserByPhone($input: UpdateUserInput!) {
        updateUserByPhone(input: $input) {
          id
          username
          email
          phoneNumber
          role
          isAdmin
          isPhoneVerified
        }
      }
    `;

    const response = await apiClient.post("", {
      query,
      variables: { input },
    });

    const graphQLError = response.data?.errors?.[0];
    if (graphQLError) {
      const errorObj = {
        message: graphQLError.message || "Unknown GraphQL Error",
        validationErrors: graphQLError.extensions?.validationErrors
      };
      throw errorObj;
    }

    return response;
  } catch (error) {
    handleApiError(error);
  }
};
