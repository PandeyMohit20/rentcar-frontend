import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import AppRoutes from '@/routes'
import ScrollToTop from '@/components/common/ScrollToTop'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import AppProviders from '@/app/AppProviders'

/**
 * Root application component.
 * Composes all cross-cutting providers and renders the route tree.
 */
function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <ToastProvider>
            <ThemeProvider>
              <ScrollToTop />
              <AppRoutes />
            </ThemeProvider>
          </ToastProvider>
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App
