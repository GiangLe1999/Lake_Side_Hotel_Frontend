import apiClient from "../api/api-client";

export const addBooking = async (data) => {
  return apiClient.post("/bookings", data);
};

export const resendConfirmationCode = async ({ bookingId, data }) => {
  return apiClient.put(`/bookings/resend-confirmation-code/${bookingId}`, data);
};

export const confirmBooking = async ({ bookingId, confirmationCode }) => {
  return apiClient.put(
    `/bookings/confirm/${bookingId}?confirmationCode=${confirmationCode}`
  );
};
