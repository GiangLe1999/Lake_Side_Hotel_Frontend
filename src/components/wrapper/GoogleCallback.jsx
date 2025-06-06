// components/GoogleCallback.js
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { saveTokens } from "../service/auth-service";
import { toast } from "react-toastify";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Lấy parameters từ URL
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const userInfo = searchParams.get("userInfo");

        if (accessToken && refreshToken) {
          // Parse user info
          const parsedUserInfo = userInfo
            ? JSON.parse(decodeURIComponent(userInfo))
            : null;

          // Lấy rememberMe option đã lưu trước khi redirect
          const rememberMe = localStorage.getItem("rememberMe") === "true";
          localStorage.removeItem("rememberMe");

          // Lưu tokens
          saveTokens(accessToken, refreshToken, rememberMe);

          // Cập nhật context
          if (parsedUserInfo) {
            login(parsedUserInfo);
          }

          toast.success("Login with Google successfully!");
          navigate("/dashboard");
        } else {
          // Có lỗi trong quá trình OAuth
          const error = searchParams.get("error");
          toast.error(error || "Google login failed");
          navigate("/login");
        }
      } catch (error) {
        console.error("Google callback error:", error);
        toast.error("An error occurred during Google login");
        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Processing Google Login...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
