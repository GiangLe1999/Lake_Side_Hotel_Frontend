import apiClient from "../api/api-client";

// API đăng ký
export const userRegister = async (data) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

// API đăng nhập
export const userLogin = async (data) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

// API đăng xuất
export const userLogout = async () => {
  const refreshToken =
    localStorage.getItem("refresh_token") ||
    sessionStorage.getItem("refresh_token");

  const response = await apiClient.post("/auth/logout", { refreshToken });
  return response.data;
};

// API lấy thông tin profile hiện tại
export const getCurrentProfile = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    return apiClient.get("/auth/profile");
  } catch (error) {
    throw error;
  }
};

// Lấy token từ storage
export const getAuthToken = () => {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
};

// Lưu token vào storage
export const saveTokens = (accessToken, refreshToken, rememberMe = false) => {
  if (rememberMe) {
    // Lưu vào localStorage nếu user chọn "Remember me" khi login hoặc register
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    // Xóa khỏi sessionStorage nếu có
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
  } else {
    // Lưu vào sessionStorage cho session hiện tại
    sessionStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("refresh_token", refreshToken);
    // Xóa khỏi localStorage nếu có
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

// Xóa tất cả token
export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
};

// Kiểm tra user đã đăng nhập chưa
export const isAuthenticated = () => {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");
  return !!token;
};

// Lấy thông tin user từ token (nếu cần decode JWT)
export const getCurrentUser = () => {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token");

  if (!token) return null;

  try {
    // Decode JWT để lấy thông tin user (nếu cần)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
