/**
 * Central type definitions used across the application.
 * JavaScript project — these serve as documentation and Shape contracts.
 */

export const Roles = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
  OWNER: 'owner',
})

export const UserStatus = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
})

export const CarFuelType = Object.freeze({
  PETROL: 'petrol',
  DIESEL: 'diesel',
  ELECTRIC: 'electric',
  HYBRID: 'hybrid',
  CNG: 'cng',
})

export const CarTransmission = Object.freeze({
  MANUAL: 'manual',
  AUTOMATIC: 'automatic',
})

export const BookingStatus = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
})

export const PaymentMethod = Object.freeze({
  CARD: 'card',
  UPI: 'upi',
  NETBANKING: 'netbanking',
  WALLET: 'wallet',
})

export const NotificationType = Object.freeze({
  BOOKING: 'booking',
  PROMOTION: 'promotion',
  ALERT: 'alert',
  SYSTEM: 'system',
})

export const ThemeMode = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark',
})

export default {
  Roles,
  UserStatus,
  CarFuelType,
  CarTransmission,
  BookingStatus,
  PaymentMethod,
  NotificationType,
  ThemeMode,
}
