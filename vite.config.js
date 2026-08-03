import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy API requests to the backend during development.
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('scheduler')
            ) {
              return 'react-vendor'
            }
            if (
              id.includes('@reduxjs') ||
              id.includes('react-redux') ||
              id.includes('redux-persist') ||
              id.includes('redux')
            ) {
              return 'redux-vendor'
            }
            if (id.includes('@mui') || id.includes('@emotion') || id.includes('@popperjs')) {
              return 'mui-vendor'
            }
            if (id.includes('@tanstack') || id.includes('query')) {
              return 'query-vendor'
            }
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'forms-vendor'
            }
            if (
              id.includes('axios') ||
              id.includes('dayjs') ||
              id.includes('framer-motion') ||
              id.includes('react-hot-toast') ||
              id.includes('motion')
            ) {
              return 'utils-vendor'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
