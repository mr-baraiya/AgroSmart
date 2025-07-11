import { Sun, Cloud, CloudRain } from "lucide-react";

const sampleData = {
  farms: [
    { id: 1, name: "Green Horizon Farm", location: "Village Alpha", acres: 12.5, fields: 5 },
    { id: 2, name: "Sunny Acres", location: "Rural Zone 5", acres: 20.0, fields: 5 },
    { id: 3, name: "EcoGrow Estate", location: "Farmbelt Region", acres: 15.75, fields: 3 }
  ],
  sensors: [
    { id: 1, type: "Temperature", value: 27.5, unit: "°C", quality: 0.95, field: "Field A1" },
    { id: 2, type: "Humidity", value: 68.2, unit: "%", quality: 0.89, field: "Field A2" },
    { id: 3, type: "Soil Moisture", value: 23.4, unit: "%", quality: 0.92, field: "Field A1" },
    { id: 4, type: "pH", value: 6.8, unit: "pH", quality: 0.98, field: "Field A3" }
  ],
  crops: [
    { id: 1, name: "Wheat", stage: "Vegetative", area: 2.5, status: "Active", health: "Good" },
    { id: 2, name: "Corn", stage: "Flowering", area: 3.0, status: "Active", health: "Excellent" },
    { id: 3, name: "Tomato", stage: "Harvested", area: 2.8, status: "Completed", health: "Average" }
  ],
  insights: [
    { id: 1, type: "Alert", title: "Soil Moisture Low", priority: "High", message: "Field A1 requires immediate irrigation" },
    { id: 2, type: "Recommendation", title: "Apply Potassium Fertilizer", priority: "Medium", message: "Recommended for Field A2" },
    { id: 3, type: "Reminder", title: "Upcoming Irrigation", priority: "Low", message: "Scheduled for tomorrow 6 AM" }
  ],
  weather: {
    current: { temp: 32.5, humidity: 60, pressure: 1012.5, wind: 5.5, description: "Partly Cloudy" },
    forecast: [
      { date: "Today", temp: 32, desc: "Sunny", icon: Sun },
      { date: "Tomorrow", temp: 31, desc: "Cloudy", icon: Cloud },
      { date: "Day 3", temp: 28, desc: "Rain", icon: CloudRain }
    ]
  }
};

export default sampleData;