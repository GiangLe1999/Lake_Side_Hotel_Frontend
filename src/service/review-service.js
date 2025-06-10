import apiClient from "../api/api-client";

export const addReview = async (data) => {
  const response = await apiClient.post("/reviews/user", data);
  return response.data;
};

export const getRoomReviews = async ({ pageNo = 0, pageSize = 9, roomId }) => {
  try {
    const response = await apiClient.get(
      `/reviews/public?pageNo=${pageNo}&pageSize=${pageSize}&roomId=${roomId}`
    );
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};
