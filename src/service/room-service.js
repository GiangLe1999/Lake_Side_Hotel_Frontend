import apiClient from "../api/api-client";

export const addRoom = async (data) => {
  const formData = new FormData();
  formData.append("type", data.type);
  formData.append("thumbnail", data.thumbnail);

  data.images.forEach((file) => {
    formData.append("images", file);
  });

  formData.append("price", data.price);

  return apiClient.post("/rooms", formData);
};

export const getRoomTypes = async () => {
  return apiClient.get("/rooms/types");
};

export const getRoomFilteredByType = async (data) => {
  return apiClient.get(
    `/rooms/filtered-by-type?pageNo=${data.pageNo}&pageSize=${data.pageSize}&roomType=${data.type}`
  );
};

export const deleteRoom = async (id) => {
  return apiClient.delete(`/rooms?id=${id}`);
};
