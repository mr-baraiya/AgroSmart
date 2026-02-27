# 🌱 AgroSmart - Smart Agriculture Management System

A comprehensive full-stack smart agriculture platform that empowers farmers and agri-businesses with real-time data, analytics, and automation. Built with modern technologies to revolutionize farming through data-driven insights and intelligent farm management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![.NET](https://img.shields.io/badge/.NET-8.0-purple.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![SQL Server](https://img.shields.io/badge/SQL%20Server-Database-red.svg)

## Live Demo

Check out AgroSmart in action:

- **Backend API (Production - SmarterASP)**:  
  https://vishalbaraiya-001-site1.site4future.com/api  

- **Swagger API Docs**:  
  https://vishalbaraiya-001-site1.site4future.com/swagger  

- **Frontend (Custom Domain)**:  
  https://agrosmart.me  

- **Frontend (Netlify Preview)**:  
  https://ecoagrosmart.netlify.app  

- **Frontend (Vercel Preview)**:  
  https://agro-smart-ctz4.vercel.app

## Features

### **Smart Dashboard**
- **Admin Dashboard** - Complete farm management system for administrators
- **User Dashboard** - Personal farm management for individual farmers
- **Real-time Analytics** - Live data visualization and insights
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### **Farm Management**
- **Multi-Farm Operations** - Create, manage, and monitor multiple farms
- **Field Management** - Organize fields within farms with detailed tracking
- **Crop Planning** - Plan and track crop rotations and growing cycles
- **Resource Optimization** - Intelligent resource usage recommendations

### **IoT & Sensor Integration**
- **Real-time Sensor Data** - Collect soil moisture, temperature, humidity data
- **Automated Monitoring** - Continuous monitoring of farm conditions
- **Smart Alerts** - Automated notifications for critical events
- **Historical Data Analysis** - Track trends and patterns over time

### **Weather Intelligence**
- **Real-time Weather Data** - Current weather conditions and forecasts
- **Weather-based Recommendations** - Smart farming suggestions based on weather
- **Climate Analytics** - Long-term climate data for better planning
- **Weather Alerts** - Early warning system for weather risks

### **AI-Powered Insights**
- **Smart Recommendations** - AI-driven farming suggestions
- **Yield Predictions** - Data-driven crop yield forecasting
- **Trend Analysis** - Historical data analysis and future predictions
- **Performance Analytics** - Farm productivity insights

### **Advanced Features**
- **Interactive Calendar** - Visual scheduling with color-coded activities
- **Task Management** - Create and track farming tasks with progress indicators
- **Knowledge Badges** - Gamification system for learning achievements
- **Multi-channel Notifications** - Email, SMS, and in-app alerts

## Technology Stack

### **Backend**
- **ASP.NET Core 8** - High-performance web API
- **Entity Framework Core** - ORM for database operations
- **Microsoft SQL Server** - Robust database management
- **JWT Authentication** - Secure token-based authentication
- **RESTful APIs** - Clean API architecture

### **Frontend**
- **React 19.1** - Modern React with latest features
- **Vite 7.0** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Beautiful animations and micro-interactions
- **React Router** - Client-side routing and navigation

### **UI & Visualization**
- **Lucide React** - Beautiful, customizable icons
- **React Big Calendar** - Interactive calendar component
- **Recharts** - Responsive chart library for data visualization
- **React Toastify** - Elegant notification system
- **SweetAlert2** - Beautiful alert dialogs

### **Communication & APIs**
- **Axios** - HTTP client for API communication
- **EmailJS** - Email service integration
- **Three.js** - 3D graphics and visualization
- **Moment.js** - Date and time manipulation

## Project Structure

```
AgroSmart/
├── AgroSmartBeackend/       # ASP.NET Core Web API
│   ├── Controllers/         # API Controllers
│   ├── Models/             # Data Models
│   ├── Services/           # Business Logic
│   ├── Data/               # Database Context
│   └── appsettings.json    # Configuration
│
├── AgroSmartFrontend/      # React + Vite Frontend
│   ├── src/
│   │   ├── Components/     # Reusable Components
│   │   ├── pages/          # Page Components
│   │   ├── services/       # API Services (21 services)
│   │   ├── contexts/       # React Contexts
│   │   ├── hooks/          # Custom Hooks
│   │   └── utils/          # Utility Functions
│   ├── docs/               # Frontend Documentation
│   └── package.json
│
├── Database/               # Database Scripts & Schema
├── Materials/              # Project Documentation & Resources
├── .github/                # GitHub Workflows & Templates
└── README.md
```

## Getting Started

### **Prerequisites**
- [.NET 8 SDK](https://dotnet.microsoft.com/download) or later
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server)
- Modern web browser

### **Installation**

#### 1. **Clone the Repository**
```bash
git clone https://github.com/mr-baraiya/AgroSmart.git
cd AgroSmart
```

#### 2. **Backend Setup (ASP.NET Core)**
```bash
# Navigate to backend directory
cd AgroSmartBeackend

# Configure database connection in appsettings.json
# Update connection string for your SQL Server

# Run database migrations
dotnet ef database update

# Install dependencies and run
dotnet restore
dotnet run
```

#### 3. **Frontend Setup (React + Vite)**
```bash
# Navigate to frontend directory
cd AgroSmartFrontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Update VITE_API_BASE_URL=http://localhost:5000/api

# Start development server
npm run dev
```

#### 4. **Database Setup**
- Ensure SQL Server is installed and running
- Create a new database for AgroSmart
- Update connection strings in backend configuration
- Run migrations to create tables

### **Build for Production**

#### Backend
```bash
cd AgroSmartBeackend
dotnet publish -c Release
```

#### Frontend
```bash
cd AgroSmartFrontend
npm run build
npm run preview
```

## 🔧 Configuration

### **Backend Configuration**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "myConnectionString": "Server=YOUR_SQL_SERVER;Database=AgroSmart;User Id=USERNAME;Password=PASSWORD;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  },

  "Jwt": {
    "Key": "YOUR_SECRET_KEY_HERE",
    "Issuer": "https://localhost:7059",
    "Audience": "*",
    "TokenExpiryMinutes": 60
  },

  "SmtpSettings": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "Username": "your_email@gmail.com",
    "Password": "your_app_password_here",
    "FromEmail": "your_email@gmail.com"
  },

  "Prerender": {
    "Token": "YOUR_PRERENDER_TOKEN_HERE"
  }
}
```

### **Frontend Environment Variables**
```env
# -------------------------------
# API Configuration
# -------------------------------
# For development
# VITE_API_BASE_URL=https://localhost:7059/api
# VITE_IMAGE_BASE_URL=https://localhost:7059

# For production (Render backend)
VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_IMAGE_BASE_URL=https://your-backend.onrender.com

# -------------------------------
# Weather API (OpenWeatherMap)
# -------------------------------
VITE_WEATHER_API_KEY=YOUR_WEATHER_API_KEY
VITE_WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5

# -------------------------------
# EmailJS Configuration
# -------------------------------
VITE_EMAILJS_USER_ID=YOUR_EMAILJS_USER_ID
VITE_EMAILJS_SERVICE_ID=YOUR_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID=YOUR_EMAILJS_TEMPLATE_ID

# -------------------------------
# AGMARKNET API (Mandi Prices)
# -------------------------------
# Get key from: https://data.gov.in/
VITE_AGMARKNET_API_KEY=YOUR_AGMARKNET_API_KEY
```

## 📊 API Services

The application includes 21 comprehensive API services:

### **User Services (9)**
- User Farm Management
- User Field Management
- User Crop Management
- User Schedule Management
- User Sensor Management
- User Weather Service
- User Smart Insights
- User Sensor Readings
- User Field-wise Crops

### **Admin Services (10)**
- Admin User Management
- Admin Farm Management
- Admin Field Management
- Admin Crop Management
- Admin Schedule Management
- Admin Sensor Management
- Admin Weather Service
- Admin Smart Insights
- Admin Sensor Readings
- Admin Field-wise Crops

### **System Services (2)**
- Authentication Service
- Health Monitoring Service

## Key Features in Detail

### **Dashboard Analytics**
- Real-time farm performance metrics
- Interactive charts and visualizations
- Weather integration and forecasts
- Sensor data monitoring
- Task and schedule management

### **Farm Management System**
- Multi-farm organization
- Field mapping and management
- Crop planning and rotation
- Resource allocation optimization
- Performance tracking and analytics

### **Smart Notifications**
- Weather alerts and warnings
- Sensor threshold notifications
- Task and schedule reminders
- System health alerts
- Custom notification preferences

### **Mobile Responsiveness**
- Fully responsive design
- Touch-friendly interface
- Offline capability
- Progressive Web App features

## Documentation

Comprehensive documentation is available:

- **[Frontend Documentation](AgroSmartFrontend/docs/)** - Complete frontend guide
- **[API Documentation](AgroSmartBeackend/docs/)** - Backend API reference
- **[Database Schema](Database/)** - Database structure and relationships
- **[Deployment Guide](Materials/)** - Production deployment instructions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Mr. Baraiya** - [GitHub Profile](https://github.com/mr-baraiya)

## Acknowledgments

- Built with modern .NET and React technologies
- Designed for farmers and agricultural professionals
- Inspired by the need for smart, data-driven farming solutions
- Thanks to all contributors and the open-source community

## Support

For support and questions:
- Open an issue on [GitHub Issues](https://github.com/mr-baraiya/AgroSmart/issues)
- Contact: [mr-baraiya](https://github.com/mr-baraiya)

---

**AgroSmart** - Empowering agriculture through technology 🌱
*Smart farming for a sustainable future*
