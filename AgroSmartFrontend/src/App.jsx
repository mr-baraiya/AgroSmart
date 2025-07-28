import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/DashBoard/Layout";
import Dashboard from "./Components/DashBoard/Dashboard";
import CropsView from "./Components/crop/CropsView";
import CropDetail from "./Components/crop/CropDetail";
import CropFormPage from "./Components/crop/CropFormPage";
import FarmsView from "./Components/farm/FarmsView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="crops" element={<CropsView />} />
          <Route path="crops/add" element={<CropFormPage />} />
          <Route path="crops/edit/:id" element={<CropFormPage />} />
          <Route path="crops/:id" element={<CropDetail />} />
          <Route path="farms" element={<FarmsView />} />
          <Route path="sensors" element={<div className="p-6"><h1 className="text-2xl font-bold">Sensors Page</h1><p>Sensors management coming soon...</p></div>} />
          <Route path="weather" element={<div className="p-6"><h1 className="text-2xl font-bold">Weather Page</h1><p>Weather information coming soon...</p></div>} />
          <Route path="schedule" element={<div className="p-6"><h1 className="text-2xl font-bold">Schedule Page</h1><p>Schedule management coming soon...</p></div>} />
          <Route path="insights" element={<div className="p-6"><h1 className="text-2xl font-bold">Insights Page</h1><p>Data insights coming soon...</p></div>} />
          <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users Page</h1><p>User management coming soon...</p></div>} />
          <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings Page</h1><p>Settings coming soon...</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;