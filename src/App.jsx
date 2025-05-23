import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddRoomPage from "./pages/AddRoomPage";
import Dashboard from "./components/layout/DashboardLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardStatsPage from "./pages/DashboardStatsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardStatsPage />} />
          <Route path="add-room" element={<AddRoomPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
