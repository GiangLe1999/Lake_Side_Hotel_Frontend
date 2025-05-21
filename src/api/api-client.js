import axios from "axios";
import { toast } from "react-toastify";
const apiUrl = import.meta.env.VITE_API_URL;

console.log(apiUrl);

// Tạo instance với cấu hình mặc định
const apiClient = axios.create({
  baseURL: apiUrl || "/api",
  timeout: 30000, // Đặt timeout phù hợp với API có upload file
  headers: {
    Accept: "application/json",
  },
});

// Lấy token từ storage
const getAuthToken = () => {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
};

// Refresh token khi cần
const refreshAuthToken = async () => {
  try {
    const refreshToken =
      localStorage.getItem("refresh_token") ||
      sessionStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // Gọi API refresh token - không sử dụng apiClient để tránh đệ quy vô hạn
    const response = await axios.post(
      `${apiUrl || "/api"}/auth/refresh-token`,
      { refreshToken }
    );

    // Lưu token mới
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Lưu vào cùng storage với token cũ
    if (localStorage.getItem("access_token")) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", newRefreshToken);
    } else {
      sessionStorage.setItem("access_token", accessToken);
      sessionStorage.setItem("refresh_token", newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    // Đăng xuất nếu không thể refresh token
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");

    // Chuyển về trang đăng nhập
    window.location.href = "/login";
    throw error;
  }
};

// Tạo biến đánh dấu đang refresh token
let isRefreshing = false;
// Hàng đợi các request đang chờ token mới
let failedQueue = [];

// Hàng đợi xử lý các request bị reject do token hết hạn, cụ thể là các request bị lỗi 401 và đang đợi refresh token
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    // Nếu có lỗi, reject tất cả
    if (error) {
      prom.reject(error);
    } else {
      // Nếu không lỗi, retry với token mới
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - thêm token vào header
// apiClient.interceptors.request.use(onFulfilled , onRejected)
// onFulfilled  là hàm xử lý khi request chuẩn bị gửi thành công (ở đây là (config) => {...}).
// onRejected là hàm xử lý khi có lỗi xảy ra trước khi request được gửi (ví dụ lỗi cấu hình request, hoặc lỗi do interceptor khác trước đó).
apiClient.interceptors.request.use(
  // Sửa config trước khi request được gửi.
  (config) => {
    // Không thêm token cho request refresh token
    if (config.url?.includes("auth/refresh-token")) {
      return config;
    }

    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // Khi có lỗi, axios sẽ nhận về một Promise bị reject với lỗi đó.
  // Mỗi lần bạn gọi axios.get(), axios.post(),... thì axios trả về một Promise.
  // Nếu có lỗi xảy ra trong interceptor trước khi request được gửi đi, thì Promise đó sẽ bị reject với error này.
  // apiClient.get('/some-url')
  // .then(res => console.log('Success:', res))
  // .catch(err => console.error('Error:', err));
  // Nếu có lỗi trong interceptor request (ví dụ lỗi config), Promise apiClient.get() sẽ reject, và catch sẽ nhận lỗi đó.
  (error) => Promise.reject(error)
);

// Response interceptor - xử lý refresh token & lỗi
// apiClient.interceptors.response.use(successHandler, errorHandler)
// successHandler: (response) => response — trả về response trực tiếp nếu request thành công
// errorHandler: hàm xử lý lỗi khi response trả về lỗi (status code >= 400)
apiClient.interceptors.response.use(
  // successHandler: (response) => response - trả về response trực tiếp nếu request thành công
  (response) => response,
  // errorHandler: hàm xử lý lỗi khi response trả về lỗi (status code >= 400)
  async (error) => {
    // Lấy cấu hình request ban đầu đã bị lỗi để có thể retry lại (gửi lại request này sau khi refresh token)
    const originalRequest = error.config;

    // Nếu server trả về lỗi 401 và request này chưa retry lần nào (_retry flag chưa set) thì bắt đầu xử lý refresh token.
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh token, thêm request vào hàng đợi
        // Nếu một request refresh token đang chạy (isRefreshing === true),
        // thì các request khác cũng gặp lỗi 401 sẽ không tự động gọi refresh token nữa mà sẽ được đưa vào hàng đợi failedQueue.

        // Tạo ra một Promise mới để "treo request lại".
        // Thay vì trả lỗi luôn, bạn push resolve và reject của request này vào failedQueue:
        return (
          new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            // Sau khi refreshAuthToken() hoàn thành, tức là đã refresh token xong thì hàm processQueue() sẽ gọi resolve(token),
            // Vì gọi resolve nên .then(token => ...) được thực thi với token mới
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err))
        );
      }

      // Đánh dấu request này đã retry và đang refresh token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token
        const newToken = await refreshAuthToken();
        // Cập nhật token cho request gốc (request hiện tại)
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // Xử lý các request trong hàng đợi với token mới (Tất cả đều được thực thi với resolve(token))
        processQueue(null, newToken);
        // Reset trạng thái
        isRefreshing = false;
        // Retry request ban đầu
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token không thành công thì tất cả trong hàng đợi sẽ gọi reject(refreshError),
        processQueue(refreshError);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi HTTP khác
    let errorMessage = "Something went wrong";

    if (error.response) {
      // Lỗi từ server với response
      const { status, data } = error.response;

      // Chuẩn hóa message
      if (data.message) {
        errorMessage = data.message;
      } else if (data.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.map((e) => e.message || e).join(", ");
      } else if (typeof data === "string") {
        errorMessage = data;
      } else {
        errorMessage = `Error: ${status}`;
      }

      // Xử lý các mã lỗi phổ biến
      switch (status) {
        case 400:
          // Bad Request - thường là lỗi validation
          break;
        case 403:
          // Forbidden - không có quyền truy cập
          toast?.error("You do not have permission to perform this action");
          break;
        case 404:
          // Not Found
          break;
        case 500:
          // Server Error
          toast?.error("Server error. Please try again later");
          break;
        default:
          // Các lỗi khác
          break;
      }
    } else if (error.request) {
      // Request đã gửi nhưng không nhận được response
      errorMessage = "No response from server. Please check your connection";
      toast?.error(errorMessage);
    } else {
      // Lỗi khi setting up request
      errorMessage = error.message;
    }

    // Trả về lỗi đã được chuẩn hóa để dễ xử lý ở frontend
    return Promise.reject({
      originalError: error,
      message: errorMessage,
      status: error.response?.status || 0,
      data: error.response?.data,
    });
  }
);

export default apiClient;
