import apiClient from "../api/api-client";

export const addRoom = async (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === "images") {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      formData.append(key, data[key]);
    }
  }

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
  return apiClient.delete(`/rooms/${id}`);
};

export const getRoomForAdmin = async (id) => {
  return apiClient.get(`/rooms/admin/${id}`);
};

export const editRoom = async ({ id, data }) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === "images") {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      formData.append(key, data[key]);
    }
  }

  return apiClient.put(`/rooms/${id}`, formData);
};

// For client APIs
export const getRoom = async (id) => {
  return apiClient.get(`/rooms/${id}`);
};

export const getRooms = async ({ pageNo = 0, pageSize = 9 }) => {
  return apiClient.get(`/rooms?pageNo=${pageNo}&pageSize=${pageSize}`);
};
