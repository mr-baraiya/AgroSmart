# 🌱 AgroSmart - Smart Agriculture Management System

A comprehensive web-based farm management platform built with React and modern technologies, designed to help farmers optimize their agricultural operations through data-driven insights and automated scheduling.

## ✨ Features

### 🏠 **Modern Dashboard**
- **Admin Dashboard** - Complete farm management system for administrators
- **User Dashboard** - Personal farm management for individual farmers
- **Real-time Analytics** - Live data visualization and insights
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 🚜 **Farm Management**
- **Farm Operations** - Create, manage, and monitor multiple farms
- **Field Management** - Organize fields within farms with detailed tracking
- **Crop Planning** - Plan and track crop rotations and growing cycles
- **Resource Allocation** - Optimize resource usage across operations

### 📅 **Smart Scheduling**
- **Interactive Calendar** - Visual scheduling with color-coded activities
- **Task Management** - Create and track farming tasks with progress indicators
- **Automated Reminders** - Never miss important farming activities
- **Season Planning** - Long-term agricultural planning and scheduling

### 🌤️ **Weather Intelligence**
- **Real-time Weather** - Current weather conditions and forecasts
- **Historical Data** - Weather pattern analysis and trends
- **Smart Alerts** - Weather-based recommendations and warnings
- **Climate Insights** - Long-term climate data for better planning

### 💡 **AI-Powered Insights**
- **Smart Recommendations** - AI-driven farming suggestions
- **Yield Predictions** - Data-driven crop yield forecasting
- **Resource Optimization** - Intelligent resource usage recommendations
- **Trend Analysis** - Historical data analysis and future predictions

### 🔔 **Notification System**
- **Real-time Alerts** - Instant notifications for important events
- **Custom Notifications** - Personalized alert preferences
- **Multi-channel Delivery** - Email, SMS, and in-app notifications
- **Activity Feed** - Comprehensive activity tracking

### 🏆 **Gamification**
- **Knowledge Badges** - Earn badges for learning and achievements
- **Progress Tracking** - Visual progress indicators and milestones
- **Learning Modules** - Educational content and farming best practices
- **Achievement System** - Reward system for farming excellence

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Framer Motion** - Beautiful animations and micro-interactions
- **React Router** - Client-side routing and navigation

### **UI Components & Libraries**
- **Lucide React** - Beautiful, customizable icons
- **React Big Calendar** - Interactive calendar component
- **Recharts** - Responsive chart library for data visualization
- **React Toastify** - Elegant notification system
- **Headless UI** - Unstyled, accessible UI components

### **State Management & API**
- **Context API** - React context for global state management
- **Axios** - HTTP client for API communication
- **JWT Authentication** - Secure token-based authentication
- **RESTful APIs** - Clean API architecture with proper error handling

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### **Installation**

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd AgroSmartFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Configure your environment variables
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME=AgroSmart
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### **Build for Production**
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
│   ├── auth/        # Authentication components
│   ├── common/      # Shared components
│   ├── crop/        # Crop management components
│   ├── farm/        # Farm management components
│   ├── field/       # Field management components
│   └── DashBoard/   # Dashboard components
├── contexts/        # React context providers
├── hooks/           # Custom React hooks
├── layouts/         # Page layout components
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   ├── guest/       # Public pages
│   └── user/        # User pages
├── services/        # API service functions
├── styles/          # CSS and styling files
└── utils/           # Utility functions
```

## 🔧 Configuration

### **Environment Variables**
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name
- `VITE_WEATHER_API_KEY` - Weather service API key (optional)

### **Customization**
- **Colors**: Modify `tailwind.config.js` for theme customization
- **Components**: Add custom components in `src/components/`
- **Pages**: Create new pages in `src/pages/`
- **Services**: Add API services in `src/services/`

## 📚 Documentation

Detailed documentation is available in the `docs/` folder:

- **[Services Documentation](docs/SERVICES_DOCUMENTATION.md)** - API service layer documentation
- **[Routing Documentation](docs/ROUTING_DOCUMENTATION.md)** - Application routing structure
- **[Folder Structure](docs/FOLDER_STRUCTURE_README.md)** - Detailed project organization
- **[Email Setup Guide](docs/EMAIL_SETUP_GUIDE.md)** - Email service configuration
- **[Forgot Password](docs/FORGOT_PASSWORD_DOCUMENTATION.md)** - Password reset functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern React and Vite for optimal performance
- Designed with farmers and agricultural professionals in mind
- Inspired by the need for smart, data-driven farming solutions

---

**AgroSmart** - Empowering farmers with intelligent agricultural management tools 🌱
