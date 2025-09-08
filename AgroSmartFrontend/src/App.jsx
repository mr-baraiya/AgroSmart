import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "./contexts/AuthProvider";
import ServerStatusProvider from "./contexts/ServerStatusProvider";
import ProtectedRoute from "./Components/auth/ProtectedRoute";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Profile from "./Components/auth/Profile";
import ForgotPassword from "./Components/auth/ForgotPassword";
import Layout from "./Components/DashBoard/Layout";
import Dashboard from "./Components/DashBoard/Dashboard";
import LandingPage from "./Components/LandingPage";
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
import WeatherAPITest from "./Components/weather/WeatherAPITest";
import ScheduleView from "./Components/schedule/ScheduleView";
import ScheduleFormPage from "./Components/schedule/ScheduleFormPage";
import ScheduleDetail from "./Components/schedule/ScheduleDetail";
import RoleBasedRedirect from "./Components/auth/RoleBasedRedirect";
import UserLayout from "./Components/user/UserDashboard/UserLayout";
import UserDashboard from "./Components/user/UserDashboard/UserDashboard";
import UserFarmsView from "./Components/user/UserFarms/UserFarmsView";
import FarmFormComponent from "./Components/user/UserFarms/FarmFormComponent";
import FarmDetailComponent from "./Components/user/UserFarms/FarmDetailComponent";
import UserFieldsView from "./Components/user/UserFields/UserFieldsView";
import FieldFormComponent from "./Components/user/UserFields/FieldFormComponent";
import FieldDetailComponent from "./Components/user/UserFields/FieldDetailComponent";
import UserCropsView from "./Components/user/UserCrops/UserCropsView";
import CropFormComponent from "./Components/user/UserCrops/CropFormComponent";
import CropDetailComponent from "./Components/user/UserCrops/CropDetailComponent";
import SchedulePage from "./pages/user/SchedulePage";
import WeatherPage from "./pages/user/WeatherPage";
import InsightsPage from "./pages/user/InsightsPage";
import NotificationsPage from "./pages/user/NotificationsPage";
import KnowledgeBadgePage from "./pages/user/KnowledgeBadgePage";
import AdminSettings from "./Components/admin/AdminSettings";
import UserSettings from "./Components/user/UserSettings";
import UsersView from "./Components/user/UsersView";
import UserFormPage from "./Components/user/UserFormPage";
import UserDetail from "./Components/user/UserDetail";
import SensorList from "./Components/admin/sensors/SensorList";
import SensorReadings from "./pages/admin/SensorReadings";

function App() {
  return (
    <AuthProvider>
      <ServerStatusProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
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
              <Route path="weather/test" element={<WeatherAPITest />} />
              <Route path="weather/add" element={<WeatherFormPage />} />
              <Route path="weather/edit/:id" element={<WeatherFormPage />} />
              <Route path="weather/:id" element={<WeatherDetail />} />
              
              {/* Schedule Routes */}
              <Route path="schedules" element={<ScheduleView />} />
              <Route path="schedules/add" element={<ScheduleFormPage />} />
              <Route path="schedules/edit/:id" element={<ScheduleFormPage />} />
              <Route path="schedules/:id" element={<ScheduleDetail />} />
              
              {/* System Management Routes */}
              <Route path="sensors" element={<SensorList />} />
              <Route path="sensors/:sensorId/readings" element={<SensorReadings />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="badges" element={<KnowledgeBadgePage />} />
              
              {/* User Management Routes */}
              <Route path="users" element={<UsersView />} />
              <Route path="users/add" element={<UserFormPage />} />
              <Route path="users/edit/:userId" element={<UserFormPage />} />
              <Route path="users/:userId" element={<UserDetail />} />
              
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            {/* Protected User Dashboard Routes */}
            <Route 
              path="/user-dashboard/*" 
              element={
                <ProtectedRoute requiredRole="User">
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              {/* User Dashboard Home */}
              <Route index element={<UserDashboard />} />
              
              {/* User Profile Routes */}
              <Route path="profile" element={<Profile />} />
              
              {/* User Farm Management Routes */}
              <Route path="my-farms" element={<UserFarmsView />} />
              <Route path="my-farms/add" element={<FarmFormComponent />} />
              <Route path="my-farms/edit/:id" element={<FarmFormComponent />} />
              <Route path="my-farms/:id" element={<FarmDetailComponent />} />
              
              {/* User Field Management Routes */}
              <Route path="my-fields" element={<UserFieldsView />} />
              <Route path="my-fields/add" element={<FieldFormComponent />} />
              <Route path="my-fields/edit/:id" element={<FieldFormComponent />} />
              <Route path="my-fields/:id" element={<FieldDetailComponent />} />
              
              {/* User Crop Management Routes */}
              <Route path="my-crops" element={<UserCropsView />} />
              <Route path="my-crops/add" element={<CropFormComponent />} />
              <Route path="my-crops/edit/:id" element={<CropFormComponent />} />
              <Route path="my-crops/:id" element={<CropDetailComponent />} />
              
              {/* User Weather & Schedule Routes */}
              <Route path="weather" element={<WeatherPage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="knowledge" element={<KnowledgeBadgePage />} />
              <Route path="settings" element={<UserSettings />} />
            </Route>

            {/* Role-based redirect route */}
            <Route 
              path="/auth/success" 
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              } 
            />
            
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
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </ServerStatusProvider>
    </AuthProvider>
  );
}

export default App;