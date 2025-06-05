import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Chrome,
  ArrowRight,
  Shield,
} from "lucide-react";
import { loginSchema, registerSchema } from "../../utils/auth-form-schema";
import { userRegister } from "../../service/auth-service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: registerMutation, isPending: registerPending } = useMutation({
    mutationFn: userRegister,
    onSuccess: ({ data }) => {
      if (data.status === 200) {
        toast.success("Register successfully");
      } else {
        toast.error("Failed to register", data.message);
      }
    },
    onError: (err) => {
      toast.error("Failed to register," + err.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(isLogin ? loginSchema : registerSchema),
    mode: "onChange",
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const onSubmit = async (data) => {
    isLogin ? () => {} : registerMutation(data);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      <div className="container mx-auto px-4 pt-16 pb-24 relative z-10">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {isLogin ? "Login" : "Register"}
              </h1>

              <p className="text-gray-600 text-lg">
                {isLogin
                  ? "Enjoy a 5-star hotel experience"
                  : "Create an account to explore amazing experiences"}
              </p>
            </div>

            {/* Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/5 to-blue-300/5 rounded-3xl"></div>

              <div className="relative z-10">
                <div className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4 text-yellow-500" />
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          {...register("fullName")}
                          type="text"
                          className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-yellow-500 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                            errors.fullName
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                            !
                          </span>
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-yellow-500" />
                      Email
                    </label>
                    <div className="relative">
                      <input
                        {...register("email")}
                        type="email"
                        className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-yellow-500 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                          errors.email ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                          !
                        </span>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-yellow-500" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-4 py-4 pr-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-yellow-500 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                          errors.password ? "border-red-500" : "border-gray-200"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                          !
                        </span>
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-yellow-500" />
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          {...register("confirmPassword")}
                          type={showConfirmPassword ? "text" : "password"}
                          className={`w-full px-4 py-4 pr-12 bg-gray-50 border-2 rounded-2xl focus:outline-none focus:border-yellow-500 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                            !
                          </span>
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  )}

                  {isLogin && (
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLogin ? false : registerPending}
                    className="main-btn w-full p-4 text-lg font-bold"
                  >
                    {(isLogin ? false : registerPending) ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {isLogin ? "Logging in..." : "Creating account..."}
                      </>
                    ) : (
                      <>
                        {isLogin ? "Login" : "Create Account"}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">
                        Or
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition transform duration-500 hover:shadow-lg flex items-center justify-center gap-3"
                  >
                    <Chrome className="w-5 h-5 text-blue-500" />
                    {isLogin ? "Login with Google" : "Register with Google"}
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    {isLogin
                      ? "Don't have an account?"
                      : "Already have an account?"}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="ml-2 text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
                    >
                      {isLogin ? "Register Now" : "Login"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
