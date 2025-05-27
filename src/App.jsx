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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardStatsPage />} />
          <Route path="rooms" element={<DashboardRoomsPage />} />
          <Route path="rooms/:id" element={<DashboardEditRoomPage />} />
          <Route path="add-room" element={<DashboardAddRoomPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
