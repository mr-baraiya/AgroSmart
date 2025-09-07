# AgroSmart - Complete Routing Documentation

## 🌐 **Routing Structure Overview**

This document provides a complete overview of the AgroSmart application's routing structure.

---

## 📋 **Public Routes** (No Authentication Required)

### Landing & Auth
- `GET /` - **Landing Page** (HomePage Component)
  - Shows LandingPage if not authenticated
  - Redirects to /dashboard if already authenticated

- `GET /login` - **Login Page**
- `GET /register` - **Registration Page**

### Legal Pages
- `GET /contact` - **Contact Us Form**
- `GET /privacy-policy` - **Privacy Policy**
- `GET /terms-of-service` - **Terms of Service**

---

## 🔐 **Protected Routes** (Authentication Required)

All protected routes are nested under `/dashboard` and require login.

### Dashboard Home
- `GET /dashboard` - **Main Dashboard** (Default landing after login)
- `GET /dashboard/home` - **Dashboard Home** (Alias for main dashboard)

### Profile Management
- `GET /dashboard/profile` - **User Profile Page**

### Farm Management
- `GET /dashboard/farms` - **Farms List View**
- `GET /dashboard/farms/add` - **Add New Farm Form**
- `GET /dashboard/farms/edit/:id` - **Edit Farm Form**
- `GET /dashboard/farms/:id` - **Farm Detail View**

### Field Management
- `GET /dashboard/fields` - **Fields List View**
- `GET /dashboard/fields/add` - **Add New Field Form**
- `GET /dashboard/fields/edit/:id` - **Edit Field Form**
- `GET /dashboard/fields/:id` - **Field Detail View**

### Crop Management
- `GET /dashboard/crops` - **Crops List View**
- `GET /dashboard/crops/add` - **Add New Crop Form**
- `GET /dashboard/crops/edit/:id` - **Edit Crop Form**
- `GET /dashboard/crops/:id` - **Crop Detail View**

### Nested Farm-Field Relationships
- `GET /dashboard/farms/:farmId/fields` - **Fields in Specific Farm**
- `GET /dashboard/farms/:farmId/fields/:fieldId` - **Specific Field in Farm**

### Field-Wise Crop Management
- `GET /dashboard/field-crops` - **Field-Wise Crops Overview**
- `GET /dashboard/fields/:fieldId/crops` - **Crops in Specific Field**
- `GET /dashboard/farms/:farmId/crops` - **All Crops in Farm**

### Weather Management
- `GET /dashboard/weather` - **Weather Information View**
- `GET /dashboard/weather/add` - **Add Weather Data Form**
- `GET /dashboard/weather/edit/:id` - **Edit Weather Data**
- `GET /dashboard/weather/:id` - **Weather Detail View**

### Schedule Management
- `GET /dashboard/schedules` - **Schedules List View**
- `GET /dashboard/schedules/add` - **Add New Schedule Form**
- `GET /dashboard/schedules/edit/:id` - **Edit Schedule Form**
- `GET /dashboard/schedules/:id` - **Schedule Detail View**

### System Management
- `GET /dashboard/sensors` - **Sensors Management** (Coming Soon)
- `GET /dashboard/insights` - **Smart Insights** (Coming Soon)
- `GET /dashboard/users` - **User Management** (Coming Soon)
- `GET /dashboard/settings` - **System Settings** (Coming Soon)

---

## ❌ **Error Handling**

### 404 Not Found
- `GET /*` - **404 Page** for any unmatched routes
  - Displays user-friendly 404 error page
  - Provides link to return home

---

## 🧭 **Navigation Flow**

### User Authentication Flow
1. **Unauthenticated User**: `/` → Landing Page
2. **Login**: `/login` → Authentication → `/dashboard`
3. **Authenticated User**: `/` → Auto-redirect to `/dashboard`

### Protected Route Access
- All `/dashboard/*` routes require authentication
- Unauthenticated access redirects to `/login`
- After login, user is redirected to `/dashboard`

### Sidebar Navigation
The sidebar provides direct navigation to all main sections:
- Dashboard → `/dashboard`
- Farms → `/dashboard/farms`
- Fields → `/dashboard/fields`
- Crops → `/dashboard/crops`
- Weather → `/dashboard/weather`
- Schedules → `/dashboard/schedules`
- Profile → `/dashboard/profile`
- And more...

---

## 🔧 **Route Parameters**

### Dynamic Route Parameters
- `:id` - Generic entity ID (farm, field, crop, etc.)
- `:farmId` - Specific farm identifier
- `:fieldId` - Specific field identifier

### Example URLs with Parameters
- `/dashboard/farms/123` - Farm with ID 123
- `/dashboard/farms/123/fields` - All fields in farm 123
- `/dashboard/fields/456/crops` - All crops in field 456

---

## ✅ **Route Validation**

### Authentication Protection
- ✅ All dashboard routes are protected
- ✅ Public routes remain accessible
- ✅ Proper redirects for unauthenticated users

### URL Structure
- ✅ Consistent `/dashboard/*` pattern for protected routes
- ✅ RESTful naming conventions
- ✅ Logical hierarchical structure

### Error Handling
- ✅ 404 page for invalid routes
- ✅ Graceful error boundaries
- ✅ User-friendly error messages

---

## 🚀 **Usage Examples**

### Common Navigation Patterns
```javascript
// Navigate to farms list
navigate('/dashboard/farms');

// Navigate to specific farm
navigate(`/dashboard/farms/${farmId}`);

// Navigate to add new crop
navigate('/dashboard/crops/add');

// Navigate to edit schedule
navigate(`/dashboard/schedules/edit/${scheduleId}`);
```

### Link Components in JSX
```jsx
// Link to farms page
<Link to="/dashboard/farms">View Farms</Link>

// Link to specific farm detail
<Link to={`/dashboard/farms/${farm.id}`}>View Farm</Link>

// Link to add new field
<Link to="/dashboard/fields/add">Add Field</Link>
```

---

This routing structure provides a clean, scalable, and intuitive navigation system for the AgroSmart application.
