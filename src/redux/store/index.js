import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { combineReducers } from 'redux'
import { storage, sessionStorage } from '@/utils/reduxPersistStorage'
import authReducer from '@/redux/slices/authSlice'
import uiReducer from '@/redux/slices/uiSlice'
import wishlistReducer from '@/redux/slices/wishlistSlice'
import bookingReducer from '@/redux/slices/bookingSlice'
import notificationReducer from '@/redux/slices/notificationSlice'

const persistConfig = {
  key: import.meta.env.VITE_PERSIST_KEY || 'rentcar-root',
  storage: import.meta.env.VITE_PERSIST_STORAGE === 'sessionStorage' ? sessionStorage : storage,
  whitelist: ['auth', 'ui', 'wishlist'],
  version: 1,
}

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  wishlist: wishlistReducer,
  booking: bookingReducer,
  notification: notificationReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const isDev = import.meta.env.MODE === 'development'
const enableDevTools = import.meta.env.VITE_ENABLE_REDUX_DEVTOOLS !== 'false'

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: isDev && enableDevTools,
})

export const persistor = persistStore(store)

export default store
