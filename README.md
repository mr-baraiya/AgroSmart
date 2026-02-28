# 🌱 AgroSmart - Smart Agriculture Management System

A comprehensive full-stack smart agriculture platform that empowers farmers and agri-businesses with real-time data, analytics, and automation. Built with modern technologies to revolutionize farming through data-driven insights and intelligent farm management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![.NET](https://img.shields.io/badge/.NET-8.0-purple.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![SQL Server](https://img.shields.io/badge/SQL%20Server-Database-red.svg)

---

## Live Demo

Check out AgroSmart in action:

### Backend APIs

- **Swagger API Docs (SmarterASP Production)**  
  [https://vishalbaraiya-001-site1.site4future.com/swagger  ](https://vishalbaraiya-001-site1.site4future.com/swagger/index.html)

- **Swagger API Docs (Render Deployment - Backup)**
-  [https://agrosmart-backend-7xdp.onrender.com/swagger  ](https://agrosmart-backend-7xdp.onrender.com/swagger/index.html)

---

## Frontend Deployments

* **Frontend (Custom Domain – Production)**
  [https://agrosmart.me](https://agrosmart.me)

* **Frontend (Cloudflare Pages URL)**
  [https://agrosmart.pages.dev](https://agrosmart.pages.dev)

* **Frontend (Netlify Preview)**
  [https://ecoagrosmart.netlify.app](https://ecoagrosmart.netlify.app)

* **Frontend (Vercel Preview)**
  [https://agro-smart-ctz4.vercel.app](https://agro-smart-ctz4.vercel.app)

---

## Tech Stack

### Backend

* ASP.NET Core 8
* Entity Framework Core
* SQL Server
* JWT Authentication
* REST APIs

### Frontend

* React 19 + Vite
* Tailwind CSS
* Framer Motion
* Recharts
* React Router

### Automation & Integrations

* n8n (workflow automation)
* Brevo (Email automation)
* EmailJS (contact form)
* OpenWeatherMap API
* AGMARKNET API

---

## Key Features

* Role-based Authentication (Admin / User)
* Farm, Field & Crop Management
* Sensor Monitoring (Soil, Temperature, Humidity)
* Weather Intelligence & Alerts
* AI-based Smart Insights
* Task & Schedule Management
* In-app & Automated Notifications
* Login & Security Alerts via n8n
* Password Reset with Secure Token System
* Multi-deployment (Render, SmarterASP, Cloudflare)

---

## n8n Automation

AgroSmart uses n8n workflows for:

* Login success notifications
* Security alert automation
* Contact form processing
* Email-based system notifications

Backend → Webhook → n8n → Email Provider

---

## Project Structure

```
AgroSmart/
│
├── AgroSmartBeackend/   # ASP.NET Core API
├── AgroSmartFrontend/   # React + Vite App
├── Database/            # SQL Scripts
├── Materials/           # Documentation
└── README.md
```

---

## 🛠 Installation

### Backend

```
cd AgroSmartBeackend
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend

```
cd AgroSmartFrontend
npm install
npm run dev
```

Configure:

* Database connection
* JWT secret
* Automation webhook
* API base URLs

---

## Configuration

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
    "myConnectionString": "Server=YOUR_SERVER;Database=AgroSmart;User Id=YOUR_USERNAME;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=True;"
  },

  "Jwt": {
    "Key": "YOUR_SUPER_SECRET_JWT_KEY_HERE",
    "Issuer": "https://yourdomain.com",
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
  },

  "AutomationSettings": {
    "WebhookUrl": "https://your-n8n-domain/webhook/agrosmart-login",
    "SecretKey": "YOUR_WEBHOOK_SECRET_KEY"
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

Never commit secrets to GitHub.

---

## Author

Mr. Baraiya
[https://github.com/mr-baraiya](https://github.com/mr-baraiya)

---

AgroSmart – Smart farming for a sustainable future.
