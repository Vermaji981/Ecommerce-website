import {
  createPaymentOrderApi,
  verifyPaymentApi
} from "./api";

export const paymentService = {
  createPaymentOrder: async (paymentData) => {
    const response = await createPaymentOrderApi(paymentData);
    return response.data;
  },

  verifyPayment: async (verificationData) => {
    const response = await verifyPaymentApi(verificationData);
    return response.data;
  }
};

export default paymentService;
