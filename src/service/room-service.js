// services/room-service.js
import apiClient from "../api/api-client";

const roomService = {
  getAll: (params = {}) => {
    // Custom params hoặc xử lý trước khi gọi API
    return apiClient.get("/rooms", { params });
  },

  getById: (id) => {
    return apiClient.get(`/rooms/${id}`);
  },

  create: (data) => {
    return apiClient.post("/rooms", data);
  },

  update: (id, data) => {
    return apiClient.put(`/rooms/${id}`, data);
  },

  delete: (id) => {
    return apiClient.delete(`/rooms/${id}`);
  },

  patch: (id, data) => {
    return apiClient.patch(`/rooms/${id}`, data);
  },

  // Thêm các method riêng biệt nếu cần
  getAvailableRooms: (date) => {
    return apiClient.get(`/rooms/available`, { params: { date } });
  },
};

export default roomService;
