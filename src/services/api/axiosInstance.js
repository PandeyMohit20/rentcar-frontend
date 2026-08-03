import axios from 'axios'
import storage from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants/app'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

/**
 * Configured Axios instance with request/response interceptors.
 */
const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request interceptor ─────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = storage.get(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor ────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling — transform into a normalized shape.
    const normalized = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message || 'Request failed',
      data: error.response?.data ?? null,
      isNetworkError: !error.response,
    }

    return Promise.reject(normalized)
  }
)

export default axiosInstance
