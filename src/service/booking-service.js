import apiClient from "../api/api-client";

export const addBooking = async (data) => {
  return apiClient.post("/bookings", data);
};

export const resendConfirmationCode = async (id, data) => {
  return apiClient.post(`/resend-confirmation-code/${id}`, data);
};
