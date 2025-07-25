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

        // Lấy query params thay vì hash
        const urlParams = new URLSearchParams(window.location.search);

        // Lấy các thông tin từ query params
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");
        const userId = urlParams.get("userId");
        const email = urlParams.get("email");
        const fullName = urlParams.get("fullName");
        const role = urlParams.get("role");

        // Kiểm tra các thông tin bắt buộc
        if (!accessToken || !refreshToken || !userId || !email) {
          console.error("Missing auth data in URL:", window.location.href);
          throw new Error("Missing required authentication data");
        }

        // Tạo object user
        const user = {
          id: parseInt(userId),
          email: decodeURIComponent(email),
          fullName: decodeURIComponent(fullName || ""),
          role: role || "USER",
        };

        // Lưu tokens
        saveTokens(accessToken, refreshToken, true);

        // Cập nhật AuthContext
        login(user);

        // Xóa query params khỏi URL để bảo mật
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // Redirect về home
        setTimeout(() => {
          window.location.replace("/");
        }, 1000);
      } catch (error) {
        console.error("Google callback error:", error);
        setError(error.message || "Authentication failed");

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

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-gray-600">Processing authentication...</span>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
