import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/DashBoard/DashBoardView";
import CropDetail from "./Components/crop/CropDetail"; // Ensure the correct path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crops/:cropId" element={<CropDetail />} />
        {/* ...other routes */}
      </Routes>
    </Router>
  );
}

export default App;