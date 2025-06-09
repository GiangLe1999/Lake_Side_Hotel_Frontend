import apiClient from "../api/api-client";

export const addBooking = async (data) => {
  const response = await apiClient.post("/bookings/public", data);
  return response.data;
};

export const resendConfirmationCode = async ({ bookingId, data }) => {
  const response = await apiClient.put(
    `/bookings/public/resend-confirmation-code/${bookingId}`,
    data
  );
  return response.data;
};

export const confirmBooking = async ({ bookingId, confirmationCode }) => {
  const response = await apiClient.put(
    `/bookings/public/confirm/${bookingId}?confirmationCode=${confirmationCode}`
  );
  return response.data;
};

export const changePaymentMethod = async ({ bookingId, paymentMethod }) => {
  const response = await apiClient.put(
    `/bookings/public/choose-payment-method/${bookingId}?paymentMethod=${paymentMethod}`
  );
  return response.data;
};
