# 🌦️ Weather App (Vite + OpenWeather API)

A simple weather application built using **Vite (React)** and the **OpenWeather API**.  
It allows users to fetch **current weather** and **5-day forecast** based on city name or location.

---

## 🚀 Features
- Search weather by city name 🌍
- Get weather by current location 📍
- Display temperature, humidity, wind speed, and conditions
- 5-day / 3-hour forecast view
- Environment variables for secure API handling

---

## 🛠️ Tech Stack
- **Frontend:** Vite + React + Tailwind CSS
- **API:** [OpenWeather API](https://openweathermap.org/api)
- **State Management:** React Hooks

---

### 4. Run the Project

```bash
npm run dev
```

---

## 🌐 API Endpoints Used

### Current Weather (by city)

```
https://api.openweathermap.org/data/2.5/weather?q={CITY_NAME}&appid={API_KEY}&units=metric
```

### 5-Day Forecast (by city)

```
https://api.openweathermap.org/data/2.5/forecast?q={CITY_NAME}&appid={API_KEY}&units=metric
```

### Current Weather (by coordinates)

```
https://api.openweathermap.org/data/2.5/weather?lat={LAT}&lon={LON}&appid={API_KEY}&units=metric
```
```

Would you like me to extend this README to also include **One Call API 3.0 (current + forecast + alerts in one request)**, since that may suit your AgroSmart project better than hitting multiple endpoints?
```
