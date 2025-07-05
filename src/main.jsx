import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import QueryClientWrapper from "./components/wrapper/QueryClientWrapper.jsx";
import ToastifyWrapper from "./components/wrapper/ToastifyWrapper.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

createRoot(document.getElementById("root")).render(
  <QueryClientWrapper>
    <AuthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AuthProvider>
    <ToastifyWrapper />
  </QueryClientWrapper>
);
