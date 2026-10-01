import axios from "axios"

const BASE_URL = import.meta.env.MODE === "development"?"http://localhost:5001/api" : "/api";

const api = axios.create({
    baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle expired token globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login' // Force redirect to login
    }
    return Promise.reject(error)
  }
)

export default api;