import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddRoomPage from "./pages/dashboard-pages/DashboardAddRoomPage";
import Dashboard from "./components/layout/DashboardLayout";
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="room/:id" element={<RoomDetailPage />} />
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
        </Route>

        {/* 404 page */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
