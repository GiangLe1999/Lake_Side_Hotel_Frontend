import apiClient from "../api/api-client";

export const paymentService = {
  createPaymentIntent: async (paymentData) => {
    const response = await apiClient.post(
      "/payments/create-payment-intent",
      paymentData
    );
    return response.data;
  },

  refundPayment: async (bookingId, amount) => {
    const response = await apiClient.post(
      `/payments/refund/${bookingId}?amount=${amount}`
    );
    return response.data;
  },
};
