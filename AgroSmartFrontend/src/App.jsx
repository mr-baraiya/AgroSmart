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
import HomePage from "./Components/HomePage";
import PrivacyPolicy from "./Components/legal/PrivacyPolicy";
import TermsOfService from "./Components/legal/TermsOfService";
import ContactUs from "./Components/legal/ContactUs";
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
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Dashboard Home */}
              <Route index element={<Dashboard />} />
              <Route path="home" element={<Dashboard />} />
              
              {/* Profile Routes */}
              <Route path="profile" element={<Profile />} />
              
              {/* Farm Management Routes */}
              <Route path="farms" element={<FarmsView />} />
              <Route path="farms/add" element={<FarmFormPage />} />
              <Route path="farms/edit/:id" element={<FarmFormPage />} />
              <Route path="farms/:id" element={<FarmDetail />} />
              
              {/* Field Management Routes */}
              <Route path="fields" element={<FieldsView />} />
              <Route path="fields/add" element={<FieldFormPage />} />
              <Route path="fields/edit/:id" element={<FieldFormPage />} />
              <Route path="fields/:id" element={<FieldDetail />} />
              
              {/* Crop Management Routes */}
              <Route path="crops" element={<CropsView />} />
              <Route path="crops/add" element={<CropFormPage />} />
              <Route path="crops/edit/:id" element={<CropFormPage />} />
              <Route path="crops/:id" element={<CropDetail />} />
              
              {/* Nested Farm-Field Routes */}
              <Route path="farms/:farmId/fields" element={<FieldsView />} />
              <Route path="farms/:farmId/fields/:fieldId" element={<FieldDetail />} />
              
              {/* Field-Wise Crop Routes */}
              <Route path="field-crops" element={<FieldWiseCropsView />} />
              <Route path="fields/:fieldId/crops" element={<FieldWiseCropsView />} />
              <Route path="farms/:farmId/crops" element={<FieldWiseCropsView />} />
              
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
              
              {/* System Management Routes */}
              <Route path="sensors" element={<div className="p-6"><h1 className="text-2xl font-bold">Sensors Management</h1><p>Sensor monitoring and management coming soon...</p></div>} />
              <Route path="insights" element={<div className="p-6"><h1 className="text-2xl font-bold">Smart Insights</h1><p>AI-powered farming insights coming soon...</p></div>} />
              <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">User Management</h1><p>User administration coming soon...</p></div>} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">System Settings</h1><p>Application settings coming soon...</p></div>} />
            </Route>
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                  <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </Router>
      </ServerStatusProvider>
    </AuthProvider>
  );
}

export default App;