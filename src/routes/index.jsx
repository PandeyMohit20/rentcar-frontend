import { lazy, Suspense } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import AccountDashboardLayout from '@/components/account/DashboardLayout'
import ProtectedRoute from '@/components/authentication/ProtectedRoute'
import GuestRoute from '@/components/authentication/GuestRoute'
import PageLoader from '@/components/common/PageLoader'
import { ROUTES } from '@/constants/routes'

/**
 * Lazy-loaded page components.
 */
const HomePage = lazy(() => import('@/pages/Home'))
const SearchPage = lazy(() => import('@/pages/Search'))
const CarDetailsPage = lazy(() => import('@/pages/CarDetails'))
const BookingStatusPage = lazy(() => import('@/pages/BookingStatus'))
const LocationsPage = lazy(() => import('@/pages/Locations'))
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicy'))
const TermsConditionsPage = lazy(() => import('@/pages/TermsConditions'))
const RefundPolicyPage = lazy(() => import('@/pages/RefundPolicy'))
const CancellationPolicyPage = lazy(() => import('@/pages/CancellationPolicy'))
const LoginPage = lazy(() => import('@/pages/Login'))
const RegisterPage = lazy(() => import('@/pages/Register'))
const VerifyEmailPage = lazy(() => import('@/pages/VerifyEmail'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPassword'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

/* ── Account / Dashboard pages ─────────────────────────────────────── */
const MyProfilePage = lazy(() => import('@/pages/account/Profile'))
const KycPage = lazy(() => import('@/pages/account/KYC'))
const MyBookingsPage = lazy(() => import('@/pages/account/Bookings'))
const BookingDetailsPage = lazy(() => import('@/pages/account/BookingDetails'))
const SavedAddressesPage = lazy(() => import('@/pages/account/SavedAddresses'))

/**
 * Wraps a lazy component in Suspense with a fallback loader.
 */
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
)

/**
 * Application route tree.
 */
function AppRoutes() {
  return (
    <Routes>
      {/* ── Public routes (MainLayout) ─────────────────────────────────── */}
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={withSuspense(HomePage)} />
        <Route path={ROUTES.SEARCH} element={withSuspense(SearchPage)} />
        <Route path={ROUTES.CAR_DETAILS} element={withSuspense(CarDetailsPage)} />
        <Route path={ROUTES.LOCATIONS} element={withSuspense(LocationsPage)} />
        <Route path={ROUTES.PRIVACY_POLICY} element={withSuspense(PrivacyPolicyPage)} />
        <Route path={ROUTES.TERMS_CONDITIONS} element={withSuspense(TermsConditionsPage)} />
        <Route path={ROUTES.REFUND_POLICY} element={withSuspense(RefundPolicyPage)} />
        <Route path={ROUTES.CANCELLATION_POLICY} element={withSuspense(CancellationPolicyPage)} />
      </Route>

      {/* ── Guest-only routes (AuthLayout) ─────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route
          path={ROUTES.LOGIN}
          element={
            <GuestRoute>
              <Suspense fallback={<PageLoader />}>
                <LoginPage />
              </Suspense>
            </GuestRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <GuestRoute>
              <Suspense fallback={<PageLoader />}>
                <RegisterPage />
              </Suspense>
            </GuestRoute>
          }
        />
        <Route
          path={ROUTES.VERIFY_EMAIL}
          element={
            <Suspense fallback={<PageLoader />}>
              <VerifyEmailPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.FORGOT_PASSWORD}
          element={
            <Suspense fallback={<PageLoader />}>
              <ForgotPasswordPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTES.RESET_PASSWORD}
          element={
            <Suspense fallback={<PageLoader />}>
              <ResetPasswordPage />
            </Suspense>
          }
        />
      </Route>

      {/* ── Protected routes (DashboardLayout) ─────────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <AccountDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.BOOKING_STATUS} element={withSuspense(BookingStatusPage)} />
        <Route
          path={ROUTES.BOOKING_HISTORY}
          element={<Navigate to={ROUTES.MY_BOOKINGS} replace />}
        />
        <Route path={ROUTES.PROFILE} element={<Navigate to={ROUTES.MY_PROFILE} replace />} />
      </Route>

      {/* ── Account / Dashboard (DashboardLayout) ──────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <AccountDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<Navigate to={ROUTES.MY_BOOKINGS} replace />} />
        <Route
          path={ROUTES.ACCOUNT_DASHBOARD}
          element={<Navigate to={ROUTES.MY_BOOKINGS} replace />}
        />
        <Route path={ROUTES.MY_PROFILE} element={withSuspense(MyProfilePage)} />
        <Route path={ROUTES.EDIT_PROFILE} element={<Navigate to={ROUTES.MY_PROFILE} replace />} />
        <Route path={ROUTES.KYC} element={withSuspense(KycPage)} />
        <Route path={ROUTES.DRIVING_LICENSE} element={<Navigate to={ROUTES.KYC} replace />} />
        <Route path={ROUTES.DOCUMENTS} element={<Navigate to={ROUTES.KYC} replace />} />
        <Route path={ROUTES.MY_BOOKINGS} element={withSuspense(MyBookingsPage)} />
        <Route path={ROUTES.BOOKING_DETAILS} element={withSuspense(BookingDetailsPage)} />
        <Route path={ROUTES.SAVED_ADDRESSES} element={withSuspense(SavedAddressesPage)} />
      </Route>

      {/* ── Fallback ───────────────────────────────────────────────────── */}
      <Route path="*" element={withSuspense(NotFoundPage)} />
    </Routes>
  )
}

export default AppRoutes
