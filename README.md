# 🌱 AgroSmart - Smart Agriculture Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![.NET](https://img.shields.io/badge/.NET-8.0-purple.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)

A comprehensive smart agriculture platform that empowers farmers and agri-businesses with data-driven insights, automated scheduling, and intelligent farm management tools. Built with modern technologies to optimize crop management, boost yields, and promote sustainable agriculture practices.

## 🚀 Features

### 🏠 **Intelligent Dashboard System**
- **Admin Dashboard** - Complete farm management and oversight for administrators
- **User Dashboard** - Personalized farm management interface for individual farmers
- **Real-time Analytics** - Live data visualization with interactive charts and graphs
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices

### 🚜 **Comprehensive Farm Management**
- **Multi-Farm Operations** - Create, manage, and monitor multiple farms from a single platform
- **Field Management** - Organize and track individual fields with detailed monitoring
- **Crop Planning & Tracking** - Plan crop rotations and monitor growing cycles
- **Resource Optimization** - Intelligent resource allocation and usage tracking
- **Yield Prediction** - Data-driven forecasting for better planning

### 📅 **Smart Scheduling & Task Management**
- **Interactive Calendar** - Visual scheduling with color-coded activities and tasks
- **Automated Task Creation** - Smart task generation based on crop cycles and seasons
- **Progress Tracking** - Monitor task completion with detailed progress indicators
- **Reminder System** - Never miss critical farming activities with smart notifications
- **Season Planning** - Long-term agricultural planning and scheduling tools

### 🌤️ **Weather Intelligence & Climate Data**
- **Real-time Weather** - Current conditions with detailed forecasts
- **Historical Weather Data** - Access to historical patterns and climate trends
- **Weather-based Alerts** - Smart notifications for weather-related risks
- **Climate Analytics** - Long-term climate data analysis for strategic planning
- **Integration Ready** - Built-in support for multiple weather API providers

### 💡 **AI-Powered Smart Insights**
- **Intelligent Recommendations** - AI-driven suggestions for optimal farming practices
- **Predictive Analytics** - Advanced analytics for yield and resource optimization
- **Trend Analysis** - Historical data analysis with future trend predictions
- **Decision Support** - Data-driven insights to support critical farming decisions

### 🔐 **Security & User Management**
- **JWT Authentication** - Secure token-based authentication system
- **Role-based Access Control** - Admin and user roles with appropriate permissions
- **Profile Management** - Comprehensive user profile and preferences system
- **Password Security** - Secure password handling with bcrypt encryption

### 🔔 **Advanced Notification System**
- **Real-time Alerts** - Instant notifications for critical events and updates
- **Email Integration** - Automated email notifications with EmailJS
- **Custom Preferences** - Personalized notification settings and preferences
- **Activity Feed** - Comprehensive activity tracking and history

## 🛠️ Technology Stack

### **Backend Architecture**
- **Framework:** ASP.NET Core Web API (.NET 8)
- **Database:** Microsoft SQL Server with Entity Framework Core 9.0
- **Authentication:** JWT Bearer Token Authentication
- **Validation:** FluentValidation for robust input validation
- **Security:** BCrypt.Net for secure password hashing
- **API Documentation:** Swagger/OpenAPI integration
- **Architecture:** RESTful API design with clean architecture principles

### **Frontend Technologies**
- **Framework:** React 18.x with modern hooks and functional components
- **Build Tool:** Vite for fast development and optimized production builds
- **Styling:** Tailwind CSS for utility-first responsive design
- **Animations:** Framer Motion for smooth animations and transitions
- **Routing:** React Router DOM for client-side navigation
- **State Management:** React Context API for global state management

### **UI Components & Libraries**
- **Icons:** Lucide React for beautiful, customizable iconography
- **Calendar:** React Big Calendar for interactive scheduling
- **Charts:** Recharts for responsive data visualizations
- **Notifications:** React Toastify for elegant toast notifications
- **Alerts:** SweetAlert2 for beautiful modal dialogs
- **HTTP Client:** Axios for API communication with error handling

### **Development & Build Tools**
- **Package Manager:** npm with lock file for dependency management
- **Linting:** ESLint with React-specific rules and configurations
- **CSS Processing:** PostCSS with Autoprefixer for cross-browser compatibility
- **Environment:** Vite dev server with hot module replacement (HMR)

## 🚀 Quick Start

### **Prerequisites**
- [.NET 8 SDK](https://dotnet.microsoft.com/download) (Required for backend)
- [Node.js](https://nodejs.org/) v18+ (Required for frontend)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) (Local or Azure)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### **Backend Setup (ASP.NET Core API)**

1. **Navigate to the backend directory:**
   ```bash
   cd AgroSmartBeackend
   ```

2. **Configure database connection:**
   - Update `appsettings.json` with your SQL Server connection string:
   ```json
   {
     "ConnectionStrings": {
       "myConnectionString": "Server=your-server;Database=AgroSmart;Trusted_Connection=True;Encrypt=False;"
     }
   }
   ```

3. **Install dependencies and run migrations:**
   ```bash
   dotnet restore
   dotnet ef database update
   ```

4. **Start the API server:**
   ```bash
   dotnet run
   ```
   
   The API will be available at `https://localhost:7059` or `http://localhost:5000`

### **Frontend Setup (React + Vite)**

1. **Navigate to the frontend directory:**
   ```bash
   cd AgroSmartFrontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the frontend root:
   ```env
   VITE_API_BASE_URL=https://localhost:7059/api
   VITE_APP_NAME=AgroSmart
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

### **Database Setup**

1. **Ensure SQL Server is running**
2. **Create the database** (if not using migrations):
   - Use the SQL scripts in the `Database/` folder
   - Or let Entity Framework create it automatically

3. **Verify connection** by checking the API health endpoint

## 📁 Project Structure

```
AgroSmart/
├── 📁 AgroSmartBeackend/          # ASP.NET Core Web API
│   ├── Controllers/               # API Controllers
│   ├── Models/                    # Data Models & Entities
│   ├── Services/                  # Business Logic Services
│   ├── Dtos/                      # Data Transfer Objects
│   ├── Validators/                # FluentValidation Rules
│   ├── Helper/                    # Utility Classes
│   ├── Program.cs                 # Application Entry Point
│   └── appsettings.json          # Configuration Settings
│
├── 📁 AgroSmartFrontend/          # React Frontend Application
│   ├── src/
│   │   ├── Components/           # Reusable React Components
│   │   │   ├── auth/            # Authentication Components
│   │   │   ├── DashBoard/       # Dashboard Components
│   │   │   ├── farm/            # Farm Management
│   │   │   ├── field/           # Field Management
│   │   │   ├── crop/            # Crop Management
│   │   │   ├── schedule/        # Scheduling Components
│   │   │   ├── weather/         # Weather Components
│   │   │   ├── user/            # User-specific Components
│   │   │   └── common/          # Shared Components
│   │   ├── pages/               # Page Components
│   │   ├── services/            # API Service Layer
│   │   ├── contexts/            # React Context Providers
│   │   ├── hooks/               # Custom React Hooks
│   │   ├── utils/               # Utility Functions
│   │   └── styles/              # Custom Styles
│   ├── public/                  # Static Assets
│   ├── docs/                    # Feature Documentation
│   ├── package.json             # Dependencies & Scripts
│   └── vite.config.js          # Vite Configuration
│
├── 📁 Database/                   # Database Schema & Scripts
├── 📁 Materials/                 # Documentation & Resources
├── 📁 .github/                   # GitHub Workflows & Templates
├── LICENSE                       # MIT License
└── README.md                     # This File
```

## 🔧 Configuration

### **Backend Configuration**
- **Database:** Update connection string in `appsettings.json`
- **JWT Settings:** Configure token expiry and secrets
- **SMTP Settings:** Set up email service credentials
- **CORS:** Configure allowed origins for frontend

### **Frontend Configuration**
- **API Endpoint:** Set `VITE_API_BASE_URL` in `.env`
- **Theme:** Customize colors in `tailwind.config.js`
- **Build Settings:** Modify `vite.config.js` for deployment

## 🧪 Development

### **Running Tests**
```bash
# Backend tests
cd AgroSmartBeackend
dotnet test

# Frontend linting
cd AgroSmartFrontend
npm run lint
```

### **Building for Production**
```bash
# Backend
cd AgroSmartBeackend
dotnet publish -c Release

# Frontend
cd AgroSmartFrontend
npm run build
```

## 📊 API Documentation

The backend API includes comprehensive Swagger documentation. Once the backend is running, visit:
- **Swagger UI:** `https://localhost:7059/swagger`
- **API Endpoints:** RESTful API with full CRUD operations
- **Authentication:** JWT Bearer token required for protected endpoints

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Development Guidelines**
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the agricultural community
- Inspired by the need for smart, sustainable farming solutions
- Thanks to all contributors and the open-source community

## 📞 Support & Contact

- **GitHub Issues:** [Create an Issue](https://github.com/mr-baraiya/AgroSmart/issues)
- **Developer:** [mr-baraiya](https://github.com/mr-baraiya)
- **Documentation:** Check the `docs/` folder for detailed guides

---

**AgroSmart** - Empowering farmers with intelligent agricultural management tools 🌱

*"Cultivating the future of agriculture through smart technology"*