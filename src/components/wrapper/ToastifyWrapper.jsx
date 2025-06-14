import React from "react";
import { ToastContainer } from "react-toastify";

const ToastifyWrapper = () => {
  return (
    <ToastContainer
      toastClassName="custom-toast"
      position="top-right" // Vị trí toast
      autoClose={3000} // Tự động ẩn sau 3s
      hideProgressBar={false} // Hiện thanh tiến trình
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" // Giao diện toast (dark, light, colored)
    />
  );
};

export default ToastifyWrapper;
