// src/services/api.js
import axios from "axios";

// ✅ Use environment variable or fallback to correct URLs
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://university-forum-mern-stack-project.vercel.app"),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Automatically attach JWT token (if available)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
