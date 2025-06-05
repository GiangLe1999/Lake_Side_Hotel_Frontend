import apiClient from "../api/api-client";

export const addBooking = async (data) => {
  return apiClient.post("/bookings/public/", data);
};

export const resendConfirmationCode = async ({ bookingId, data }) => {
  return apiClient.put(
    `/bookings/public/resend-confirmation-code/${bookingId}`,
    data
  );
};

export const confirmBooking = async ({ bookingId, confirmationCode }) => {
  return apiClient.put(
    `/bookings/public/confirm/${bookingId}?confirmationCode=${confirmationCode}`
  );
};

export const changePaymentMethod = async ({ bookingId, paymentMethod }) => {
  return apiClient.put(
    `/bookings/public/choose-payment-method/${bookingId}?paymentMethod=${paymentMethod}`
  );
};
