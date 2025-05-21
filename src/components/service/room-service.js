// services/add-room.js

import apiClient from "../../api/api-client";

/**
 * Gửi request tạo mới một phòng
 * @param {Object} data - Dữ liệu phòng cần tạo
 * @param {string} data.type - Loại phòng
 * @param {File} data.thumbnail - Ảnh đại diện
 * @param {File[]} data.images - Các ảnh chi tiết
 * @param {number} data.price - Giá phòng
 * @returns {Promise}
 */
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
