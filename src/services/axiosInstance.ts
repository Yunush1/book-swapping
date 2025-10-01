import axios, { AxiosInstance, AxiosResponse } from "axios";

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
    if (error.response?.status === 401) {
      // Handle unauthorized error
      getNewAccessToken({refreshToken: localStorage.getItem('refreshToken')});
      console.warn("Unauthorized - maybe redirect to login?");
    }
    if(error.response?.status === 403) {
      // Handle forbidden error
      console.warn("Forbidden - maybe redirect to login?");
    }
    return Promise.reject(error);
  }
);

// Get new Access token

// api.interceptors.response.use((response) => response, async (error) => {})
const getNewAccessToken = async ({refreshToken}) => {
  try {
    const res = await api.get(`auth/get-access-token?refreshToken=${refreshToken}`);
    console.log('res', res)
    localStorage.setItem('accessToken', res.data.accessToken);
  } catch (error) {
    console.log('error', error)
  }
};

export default api;
