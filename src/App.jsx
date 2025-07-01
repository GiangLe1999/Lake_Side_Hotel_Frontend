import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardStatsPage from "./pages/dashboard-pages/DashboardStatsPage";
import DashboardAddRoomPage from "./pages/dashboard-pages/DashboardAddRoomPage";
import DashboardRoomsPage from "./pages/dashboard-pages/DashboardRoomsPage";
import DashboardEditRoomPage from "./pages/dashboard-pages/DashboardEditRoomPage";
import PublicLayout from "./components/layout/PublicLayout";
import HomePage from "./pages/public-pages/HomePage";
import RoomDetailPage from "./pages/public-pages/RoomDetailPage";
import ScrollToTop from "./components/layout/ScrollToTop";
import AuthPage from "./pages/public-pages/AuthPage";
import ProtectedRoute from "./components/wrapper/ProtectedRoute";
import GoogleCallback from "./components/wrapper/GoogleCallback";
import RoomsListingPage from "./pages/public-pages/RoomListingPage";
import LiveChatButton from "./components/live-chat/LiveChatButton";
import ChatWidget from "./components/live-chat/ChatWidget";
import DashboardCustomerSupportPage from "./pages/dashboard-pages/DashboardCustomerSupport";
import ServicesPage from "./pages/public-pages/ServicesPage";
import AboutUsPage from "./pages/public-pages/AboutUsPage";
import ContactPage from "./pages/public-pages/ContactPage";

function App() {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="room/:id" element={<RoomDetailPage />} />
            <Route path="room-listing" element={<RoomsListingPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="/login" element={<AuthPage />} />
          </Route>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardStatsPage />} />
            <Route path="rooms" element={<DashboardRoomsPage />} />
            <Route path="rooms/:id" element={<DashboardEditRoomPage />} />
            <Route path="add-room" element={<DashboardAddRoomPage />} />
            <Route path="chat" element={<DashboardCustomerSupportPage />} />
          </Route>

          {/* OAuth callback route */}
          <Route path="/oauth/callback" element={<GoogleCallback />} />

          {/* 404 page */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>

      <LiveChatButton />
      <ChatWidget />
    </div>
  );
}

export default App;
