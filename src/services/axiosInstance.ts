import axios, { AxiosInstance,  AxiosResponse } from "axios";

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api",
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Example: attach token if available
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle global errors (like 401, 403, etc.)
    if (error.response?.status === 401) {
      console.warn("Unauthorized - maybe redirect to login?");
    }
    return Promise.reject(error);
  }
);

export default api;
