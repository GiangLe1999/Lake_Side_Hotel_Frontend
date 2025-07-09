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

export const getUserBookings = async () => {
  const response = await apiClient.get("/bookings/user");
  return response.data.data;
};

export const cancelUserBooking = async (bookingId) => {
  const response = await apiClient.put(
    `/bookings/user/cancel?bookingId=${bookingId}`
  );

  console.log(response.data.data);
  return response.data.data;
};
