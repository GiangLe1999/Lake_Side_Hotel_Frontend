import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import QueryClientWrapper from "./components/wrapper/query-client-wrapper.jsx";
import ToastifyWrapper from "./components/wrapper/toastify-wrapper.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientWrapper>
      <App />
      <ToastifyWrapper />
    </QueryClientWrapper>
  </StrictMode>
);
