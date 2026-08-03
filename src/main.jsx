import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import '@/styles/global.css'
import App from '@/App'
import { store, persistor } from '@/redux/store'
import { queryClient } from '@/services/queryClient'
import FullPageLoader from '@/components/loaders/FullPageLoader'

const isDev = import.meta.env.MODE === 'development'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={<FullPageLoader />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <App />
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            {isDev && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </StrictMode>
)
