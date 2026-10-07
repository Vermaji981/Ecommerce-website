import {
  registerUserApi,
  loginUserApi,
  verifyOtpApi,
  forgotPasswordApi,
  resetPasswordApi
} from "./api";

export const authService = {
  login: async (credentials) => {
    const response = await loginUserApi(credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await registerUserApi(userData);
    return response.data;
  },

  verifyOtp: async (data) => {
    const response = await verifyOtpApi(data);
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await forgotPasswordApi(data);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await resetPasswordApi(data);
    return response.data;
  }
};

export default authService;
