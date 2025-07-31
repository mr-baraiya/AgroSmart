import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import ServerStatusProvider from "./contexts/ServerStatusProvider";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Profile from "./Components/auth/Profile";
import Layout from "./Components/DashBoard/Layout";
import Dashboard from "./Components/DashBoard/Dashboard";
import CropsView from "./Components/crop/CropsView";
import CropDetail from "./Components/crop/CropDetail";
import CropFormPage from "./Components/crop/CropFormPage";
import FarmsView from "./Components/farm/FarmsView";
import FarmFormPage from "./Components/farm/FarmFormPage";
import FarmDetail from "./Components/farm/FarmDetail";
import FieldsView from "./Components/field/FieldsView";
import FieldFormPage from "./Components/field/FieldFormPage";
import FieldDetail from "./Components/field/FieldDetail";
import FieldWiseCropsView from "./Components/fieldWiseCrop/FieldWiseCropsView";
import WeatherView from "./Components/weather/WeatherView";
import WeatherFormPage from "./Components/weather/WeatherFormPage";
import WeatherDetail from "./Components/weather/WeatherDetail";
import ScheduleView from "./Components/schedule/ScheduleView";
import ScheduleFormPage from "./Components/schedule/ScheduleFormPage";
import ScheduleDetail from "./Components/schedule/ScheduleDetail";

function App() {
  return (
    <AuthProvider>
      <ServerStatusProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              
              {/* Crops Routes */}
              <Route path="crops" element={<CropsView />} />
              <Route path="crops/add" element={<CropFormPage />} />
              <Route path="crops/edit/:id" element={<CropFormPage />} />
              <Route path="crops/:id" element={<CropDetail />} />
              
              {/* Farms Routes */}
              <Route path="farms" element={<FarmsView />} />
              <Route path="farms/add" element={<FarmFormPage />} />
              <Route path="farms/edit/:id" element={<FarmFormPage />} />
              <Route path="farms/:id" element={<FarmDetail />} />
              <Route path="farms/:farmId/fields" element={<FieldsView />} />
              
              {/* Fields Routes */}
              <Route path="fields" element={<FieldsView />} />
              <Route path="fields/add" element={<FieldFormPage />} />
              <Route path="fields/edit/:id" element={<FieldFormPage />} />
              <Route path="fields/:id" element={<FieldDetail />} />
              <Route path="fields/:fieldId/crops" element={<FieldWiseCropsView />} />
              <Route path="farms/:farmId/crops" element={<FieldWiseCropsView />} />
              
              {/* Field Crops Routes */}
              <Route path="field-crops" element={<FieldWiseCropsView />} />
              <Route path="field-crops/add" element={<div className="p-6"><h1 className="text-2xl font-bold">Add Field Crop</h1><p>Field crop form coming soon...</p></div>} />
              <Route path="field-crops/edit/:id" element={<div className="p-6"><h1 className="text-2xl font-bold">Edit Field Crop</h1><p>Field crop edit form coming soon...</p></div>} />
              
              {/* Sensors Routes */}
              <Route path="sensors" element={<div className="p-6"><h1 className="text-2xl font-bold">Sensors Page</h1><p>Sensors management coming soon...</p></div>} />
              
              {/* Weather Routes */}
              <Route path="weather" element={<WeatherView />} />
              <Route path="weather/add" element={<WeatherFormPage />} />
              <Route path="weather/edit/:id" element={<WeatherFormPage />} />
              <Route path="weather/:id" element={<WeatherDetail />} />
              
              {/* Schedule Routes */}
              <Route path="schedules" element={<ScheduleView />} />
              <Route path="schedules/add" element={<ScheduleFormPage />} />
              <Route path="schedules/edit/:id" element={<ScheduleFormPage />} />
              <Route path="schedules/:id" element={<ScheduleDetail />} />
              <Route path="schedule" element={<ScheduleView />} />
              
              {/* Other Routes */}
              <Route path="insights" element={<div className="p-6"><h1 className="text-2xl font-bold">Insights Page</h1><p>Data insights coming soon...</p></div>} />
              <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">Users Page</h1><p>User management coming soon...</p></div>} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings Page</h1><p>Settings coming soon...</p></div>} />
            </Route>
          </Routes>
        </Router>
      </ServerStatusProvider>
    </AuthProvider>
  );
}

export default App;