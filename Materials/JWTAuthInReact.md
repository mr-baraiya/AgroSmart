# 🔐 JWT Auth in React – Full Breakdown with Descriptions

---

## ✅ 1. Project Structure (Recommended)

```
src/
│
├── api/
│   └── axios.js             # Axios instance that automatically sends JWT token
│
├── context/
│   └── AuthContext.jsx      # Provides global auth state (login, logout, user)
│
├── pages/
│   ├── Login.jsx            # Login form, fetches token from backend
│   └── Dashboard.jsx        # Protected dashboard page, shows user info
│
├── routes/
│   └── ProtectedRoute.jsx   # Protects private routes (checks if user is logged in)
│
├── App.jsx                  # Main routing file
└── main.jsx                 # Entry point
```

---

## 📁 2. `AuthContext.jsx` – Global Authentication State

### 💡 Purpose:

* Holds current user info
* Stores JWT token in `localStorage`
* Provides `login` and `logout` methods

### 📄 Code with Description:

```jsx
// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

const AuthContext = createContext(); // Create context

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state from decoded JWT

  // Load user from token on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser(decoded);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwt_decode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // Hook to use auth
```

---

## 📁 3. `Login.jsx` –  Login Form

### 💡 Purpose:

* Accepts user credentials
* Sends POST request to backend
* On success, stores JWT via `login()` from context

### 📄 Code:

```jsx
// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");        // Input state
  const [password, setPassword] = useState("");
  const { login } = useAuth();                   // Login method from context
  const navigate = useNavigate();                // Navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:9705/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.token);  // Save token
      navigate("/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 my-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 my-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Login
      </button>
    </form>
  );
};

export default Login;
```

---

## 📁 4. `Dashboard.jsx` –  Protected Page

### 💡 Purpose:

* Fetches protected data from backend
* Displays user info decoded from JWT
* Has logout button

### 📄 Code:

```jsx
// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProtected = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:9705/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setMessage(res.ok ? data.message : "Access denied");
    };

    fetchProtected();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Welcome, {user?.email}</h1>
      <p className="my-4">{message}</p>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
```

---

## 📁 5. `ProtectedRoute.jsx` –  Route Guard

### 💡 Purpose:

* Checks if a valid user exists in auth context
* If not logged in → redirect to `/login`

### 📄 Code:

```jsx
// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
```

---

## 📁 6. `App.jsx` – 🗺️ Routing

### 💡 Purpose:

* Defines routes
* Wraps app in `AuthProvider`
* Protects dashboard using `ProtectedRoute`

### 📄 Code:

```jsx
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

---

## 📁 7. `axios.js` – 🌐 API Wrapper (Optional but Recommended)

### 💡 Purpose:

* Automatically attach JWT token to all outgoing requests

### 📄 Code:

```js
// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9705/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

Usage:

```js
import api from "../api/axios";
await api.get("/protected");  // JWT auto-attached
```

---

## ✅ Summary Table

| File                 | Purpose                                                 |
| -------------------- | ------------------------------------------------------- |
| `AuthContext.jsx`    | Stores user info, handles login/logout, token storage   |
| `Login.jsx`          | Sends credentials, receives and stores JWT              |
| `Dashboard.jsx`      | Fetches protected data, shows decoded user info, logout |
| `ProtectedRoute.jsx` | Redirects to login if not authenticated                 |
| `App.jsx`            | Main router setup with protected and public routes      |
| `axios.js`           | Axios wrapper with token auto-attach                    |
