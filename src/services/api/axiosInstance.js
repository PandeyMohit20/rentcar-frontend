import axios from 'axios'
import storage from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants/app'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 30000),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
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
