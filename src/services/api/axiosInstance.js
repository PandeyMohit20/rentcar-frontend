import axios from 'axios'
import authSession from './authSession'

const baseURL = import.meta.env.VITE_API_BASE_URL
const timeout = Number(import.meta.env.VITE_API_TIMEOUT || 30000)
const axiosInstance = axios.create({
  baseURL, withCredentials: true, timeout,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})
const sessionChanged = () => ({ status: 401, message: 'Your session has changed. Please sign in again.', sessionChanged: true })
const publicAuth = url => /^\/auth\/(login|register|forgot-password|reset-password|verify-email|resend-verification|send-otp|verify-otp)$/.test(url || '')
function normalize(error) {
  const status = error.response?.status
  const data = error.response?.data
  const isNetworkError = !error.response
  const isTimeout = ['ECONNABORTED', 'ETIMEDOUT'].includes(error.code)
  let message = isTimeout ? 'The request timed out. Check the latest status before trying again.' :
    isNetworkError ? 'Connection interrupted. Please check your connection and try again.' :
    status >= 500 ? 'The service is temporarily unavailable. Please try again shortly.' :
    typeof data?.message === 'string' ? data.message : 'The request could not be completed.'
  if (status === 413 || data?.error?.code === 'LIMIT_FILE_SIZE') message = 'File is too large. Choose a file up to 10 MB.'
  // Preserve only intentional validation details, never a development stack.
  return { status, message, isNetworkError, isTimeout,
    data: data && !(data instanceof Blob) ? { message, error: { code: data.error?.code, details: data.error?.details } } : null }
}
function expire(version) {
  if (authSession.getVersion() !== version) return
  authSession.clear()
  window.dispatchEvent(new CustomEvent('rentcar:session-expired'))
}
function subject(token) { try { return JSON.parse(atob(token.split('.')[1].replaceAll('-', '+').replaceAll('_', '/'))).sub } catch { return null } }
let refreshPromise = null
function refreshAccessToken(version) {
  if (!refreshPromise || refreshPromise.version !== version) {
    const promise = axios.post(baseURL + '/auth/refresh', {}, { withCredentials: true, timeout })
      .then(response => {
        const token = response.data?.data?.accessToken
        const priorSubject = subject(authSession.getAccessToken())
        if (priorSubject && subject(token) !== priorSubject) { expire(version); throw sessionChanged() }
        if (!token) throw { response: { status: 502 }, code: 'INVALID_REFRESH' }
        if (!authSession.replaceAccessToken(token, version)) throw sessionChanged()
        return token
      }).finally(() => { if (refreshPromise?.promise === promise) refreshPromise = null })
    refreshPromise = { version, promise }
  }
  return refreshPromise.promise
}
axiosInstance.interceptors.request.use(config => {
  config._sessionVersion ??= authSession.getVersion()
  if (config._sessionVersion !== authSession.getVersion()) return Promise.reject(sessionChanged())
  const token = authSession.getAccessToken()
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})
axiosInstance.interceptors.response.use(response => {
  if (response.config._sessionVersion !== authSession.getVersion()) return Promise.reject(sessionChanged())
  return response
}, async error => {
  if (error.sessionChanged) return Promise.reject(error)
  const request = error.config
  const version = request?._sessionVersion
  if (version !== undefined && version !== authSession.getVersion()) return Promise.reject(sessionChanged())
  if (error.response?.status === 401 && request && !publicAuth(request.url) && request.url !== '/auth/refresh') {
    if (request._retry) { expire(version); return Promise.reject(normalize(error)) }
    request._retry = true
    try {
      // A delayed 401 may belong to the token that another request already refreshed.
      const current = authSession.getAccessToken()
      const token = current && request.headers.Authorization !== 'Bearer ' + current ? current : await refreshAccessToken(version)
      if (version !== authSession.getVersion()) return Promise.reject(sessionChanged())
      request.headers.Authorization = 'Bearer ' + token
      return axiosInstance(request)
    } catch (refreshError) {
      if (refreshError.sessionChanged) return Promise.reject(refreshError)
      if ([401,403].includes(refreshError.response?.status)) expire(version)
      // Offline, timeout, 429 and 5xx refresh failures are recoverable; preserve the session.
      return Promise.reject(normalize(refreshError))
    }
  }
  return Promise.reject(normalize(error))
})
export default axiosInstance

