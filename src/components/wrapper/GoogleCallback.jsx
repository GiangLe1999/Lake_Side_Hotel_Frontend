// components/OAuthCallback.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveTokens } from "../../service/auth-service";
import { useAuth } from "../../hooks/useAuth";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login, setError, setLoading } = useAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        setLoading(true);

        // Lấy fragment từ URL (phần sau dấu #)
        const hash = window.location.hash.substring(1);

        if (!hash) {
          // Nếu không có hash, kiểm tra xem có phải do Vercel không?
          console.error("No hash found in URL");
          navigate("/login");
          return;
        }

        // Parse parameters từ fragment
        const params = new URLSearchParams(hash);

        // Lấy các thông tin từ URL
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const userId = params.get("userId");
        const email = params.get("email");
        const fullName = params.get("fullName");
        const role = params.get("role");

        // Kiểm tra các thông tin bắt buộc
        if (!accessToken || !refreshToken || !userId || !email) {
          throw new Error("Missing required authentication data");
        }

        // Tạo object user từ thông tin nhận được
        const user = {
          id: parseInt(userId),
          email: decodeURIComponent(email),
          fullName: decodeURIComponent(fullName || ""),
          role: role || "USER",
        };

        // Lưu tokens vào localStorage/sessionStorage
        saveTokens(accessToken, refreshToken, true);

        // Cập nhật AuthContext với thông tin user
        login(user);

        // Xóa fragment khỏi URL để bảo mật
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        setTimeout(() => {
          window.location.replace("/");
        }, 2000);
      } catch (error) {
        console.error("Google callback error:", error);
        setError(error.message || "Authentication failed");

        // Redirect về trang login nếu có lỗi
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } finally {
        setProcessing(false);
        setLoading(false);
      }
    };

    handleGoogleCallback();
  }, [login, setError, setLoading, navigate]);

  // UI loading/error states
  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
