// src/services/api.js
import axios from "axios";

// ✅ Deployed backend URL
const api = axios.create({
  baseURL: "https://university-forum-mern-stack-project.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach JWT token (if available) to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
