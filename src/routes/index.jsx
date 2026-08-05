import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
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
const BookingPage = lazy(() => import('@/pages/Booking'))
const CheckoutPage = lazy(() => import('@/pages/Checkout'))
const PaymentPage = lazy(() => import('@/pages/Payment'))
const BookingHistoryPage = lazy(() => import('@/pages/BookingHistory'))
const WishlistPage = lazy(() => import('@/pages/Wishlist'))
const OffersPage = lazy(() => import('@/pages/Offers'))
const ProfilePage = lazy(() => import('@/pages/Profile'))
const NotificationsPage = lazy(() => import('@/pages/Notifications'))
const SupportPage = lazy(() => import('@/pages/Support'))
const AboutPage = lazy(() => import('@/pages/About'))
const ContactPage = lazy(() => import('@/pages/Contact'))
const FaqPage = lazy(() => import('@/pages/FAQ'))
const BlogPage = lazy(() => import('@/pages/Blog'))
const LegalPage = lazy(() => import('@/pages/Legal'))
const CarCategoriesPage = lazy(() => import('@/pages/CarCategories'))
const MembershipPage = lazy(() => import('@/pages/Membership'))
const LocationsPage = lazy(() => import('@/pages/Locations'))
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicy'))
const TermsConditionsPage = lazy(() => import('@/pages/TermsConditions'))
const RefundPolicyPage = lazy(() => import('@/pages/RefundPolicy'))
const CancellationPolicyPage = lazy(() => import('@/pages/CancellationPolicy'))
const LoginPage = lazy(() => import('@/pages/Login'))
const RegisterPage = lazy(() => import('@/pages/Register'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPassword'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPassword'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

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
        <Route path={ROUTES.OFFERS} element={withSuspense(OffersPage)} />
        <Route path={ROUTES.ABOUT} element={withSuspense(AboutPage)} />
        <Route path={ROUTES.CONTACT} element={withSuspense(ContactPage)} />
        <Route path={ROUTES.FAQ} element={withSuspense(FaqPage)} />
        <Route path={ROUTES.BLOG} element={withSuspense(BlogPage)} />
        <Route path={ROUTES.LEGAL} element={withSuspense(LegalPage)} />
        <Route path={ROUTES.CAR_CATEGORIES} element={withSuspense(CarCategoriesPage)} />
        <Route path={ROUTES.MEMBERSHIP} element={withSuspense(MembershipPage)} />
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
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.BOOKING} element={withSuspense(BookingPage)} />
        <Route path={ROUTES.CHECKOUT} element={withSuspense(CheckoutPage)} />
        <Route path={ROUTES.PAYMENT} element={withSuspense(PaymentPage)} />
        <Route path={ROUTES.BOOKING_HISTORY} element={withSuspense(BookingHistoryPage)} />
        <Route path={ROUTES.WISHLIST} element={withSuspense(WishlistPage)} />
        <Route path={ROUTES.PROFILE} element={withSuspense(ProfilePage)} />
        <Route path={ROUTES.NOTIFICATIONS} element={withSuspense(NotificationsPage)} />
        <Route path={ROUTES.SUPPORT} element={withSuspense(SupportPage)} />
      </Route>

      {/* ── Fallback ───────────────────────────────────────────────────── */}
      <Route path="*" element={withSuspense(NotFoundPage)} />
    </Routes>
  )
}

export default AppRoutes
