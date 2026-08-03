import { createContext, useContext, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'

const ToastContext = createContext(null)

/**
 * Toast provider exposing convenient toast helpers.
 */
export function ToastProvider({ children }) {
  const showToast = useCallback((message, options = {}) => {
    toast(message, options)
  }, [])

  const showSuccess = useCallback((message, options = {}) => {
    toast.success(message, options)
  }, [])

  const showError = useCallback((message, options = {}) => {
    toast.error(message, options)
  }, [])

  const showWarning = useCallback((message, options = {}) => {
    toast(message, { ...options, icon: '⚠️' })
  }, [])

  const showLoading = useCallback((message, options = {}) => {
    return toast.loading(message, options)
  }, [])

  const dismiss = useCallback((id) => {
    toast.dismiss(id)
  }, [])

  const value = useMemo(
    () => ({ showToast, showSuccess, showError, showWarning, showLoading, dismiss }),
    [showToast, showSuccess, showError, showWarning, showLoading, dismiss]
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

/**
 * Access toast helpers.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default ToastProvider
