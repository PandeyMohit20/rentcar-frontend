import axios from 'axios'
import authSession from './authSession'

const baseURL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 30000),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authSession.getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isUnauthorized = error.response?.status === 401
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh')

    if (isUnauthorized && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true
      try {
        const token = await refreshAccessToken()
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${token}`
        return axiosInstance(originalRequest)
      } catch {
        authSession.clear()
        window.dispatchEvent(new CustomEvent('rentcar:session-expired'))
      }
    }

    const normalized = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message || 'Request failed',
      data: error.response?.data ?? null,
      isNetworkError: !error.response,
    }

    return Promise.reject(normalized)
  }
)

let refreshPromise = null

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
      .then((response) => {
        const token = response.data?.data?.accessToken
        if (!token) throw new Error('Refresh response did not include an access token')
        authSession.setAccessToken(token)
        return token
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

export default axiosInstance
