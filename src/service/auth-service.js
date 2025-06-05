import apiClient from "../api/api-client";

export const userRegister = async (data) => {
  return apiClient.post("/auth/register", data);
};
