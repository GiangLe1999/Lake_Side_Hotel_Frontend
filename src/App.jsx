import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddRoomPage from "./pages/AddRoomPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/add-room" element={<AddRoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;
