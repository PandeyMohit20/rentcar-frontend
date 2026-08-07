import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
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

/* ── Account / Dashboard pages ─────────────────────────────────────── */
const DashboardPage = lazy(() => import('@/pages/account/Dashboard'))
const MyProfilePage = lazy(() => import('@/pages/account/Profile'))
const EditProfilePage = lazy(() => import('@/pages/account/EditProfile'))
const KycPage = lazy(() => import('@/pages/account/KYC'))
const DrivingLicensePage = lazy(() => import('@/pages/account/DrivingLicense'))
const WalletPage = lazy(() => import('@/pages/account/Wallet'))
const WalletHistoryPage = lazy(() => import('@/pages/account/WalletHistory'))
const MyBookingsPage = lazy(() => import('@/pages/account/Bookings'))
const BookingDetailsPage = lazy(() => import('@/pages/account/BookingDetails'))
const TripHistoryPage = lazy(() => import('@/pages/account/Trips'))
const TripDetailsPage = lazy(() => import('@/pages/account/TripDetails'))
const SavedAddressesPage = lazy(() => import('@/pages/account/SavedAddresses'))
const AccountWishlistPage = lazy(() => import('@/pages/account/AccountWishlist'))
const AccountNotificationsPage = lazy(() => import('@/pages/account/Notifications'))
const ReviewsPage = lazy(() => import('@/pages/account/Reviews'))
const AccountSupportPage = lazy(() => import('@/pages/account/Support'))
const CreateTicketPage = lazy(() => import('@/pages/account/CreateTicket'))
const TicketDetailsPage = lazy(() => import('@/pages/account/TicketDetails'))
const ReferralPage = lazy(() => import('@/pages/account/Referral'))
const RewardsPage = lazy(() => import('@/pages/account/Rewards'))
const AccountSettingsPage = lazy(() => import('@/pages/account/Settings'))
const SecurityPage = lazy(() => import('@/pages/account/Security'))
const PrivacyPage = lazy(() => import('@/pages/account/Privacy'))
const DevicesPage = lazy(() => import('@/pages/account/Devices'))
const DocumentsPage = lazy(() => import('@/pages/account/Documents'))
const DeleteAccountPage = lazy(() => import('@/pages/account/DeleteAccount'))

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

      {/* ── Account / Dashboard (DashboardLayout) ──────────────────────── */}
      <Route
        element={
          <ProtectedRoute>
            <AccountDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index path={ROUTES.DASHBOARD} element={withSuspense(DashboardPage)} />
        <Route path={ROUTES.MY_PROFILE} element={withSuspense(MyProfilePage)} />
        <Route path={ROUTES.EDIT_PROFILE} element={withSuspense(EditProfilePage)} />
        <Route path={ROUTES.KYC} element={withSuspense(KycPage)} />
        <Route path={ROUTES.DRIVING_LICENSE} element={withSuspense(DrivingLicensePage)} />
        <Route path={ROUTES.WALLET} element={withSuspense(WalletPage)} />
        <Route path={ROUTES.WALLET_HISTORY} element={withSuspense(WalletHistoryPage)} />
        <Route path={ROUTES.MY_BOOKINGS} element={withSuspense(MyBookingsPage)} />
        <Route path={ROUTES.BOOKING_DETAILS} element={withSuspense(BookingDetailsPage)} />
        <Route path={ROUTES.TRIP_HISTORY} element={withSuspense(TripHistoryPage)} />
        <Route path={ROUTES.TRIP_DETAILS} element={withSuspense(TripDetailsPage)} />
        <Route path={ROUTES.SAVED_ADDRESSES} element={withSuspense(SavedAddressesPage)} />
        <Route path={ROUTES.ACCOUNT_WISHLIST} element={withSuspense(AccountWishlistPage)} />
        <Route
          path={ROUTES.ACCOUNT_NOTIFICATIONS}
          element={withSuspense(AccountNotificationsPage)}
        />
        <Route path={ROUTES.REVIEWS} element={withSuspense(ReviewsPage)} />
        <Route path={ROUTES.ACCOUNT_SUPPORT} element={withSuspense(AccountSupportPage)} />
        <Route path={ROUTES.CREATE_TICKET} element={withSuspense(CreateTicketPage)} />
        <Route path={ROUTES.TICKET_DETAILS} element={withSuspense(TicketDetailsPage)} />
        <Route path={ROUTES.REFERRAL} element={withSuspense(ReferralPage)} />
        <Route path={ROUTES.REWARDS} element={withSuspense(RewardsPage)} />
        <Route path={ROUTES.ACCOUNT_SETTINGS} element={withSuspense(AccountSettingsPage)} />
        <Route path={ROUTES.SECURITY} element={withSuspense(SecurityPage)} />
        <Route path={ROUTES.PRIVACY} element={withSuspense(PrivacyPage)} />
        <Route path={ROUTES.DEVICES} element={withSuspense(DevicesPage)} />
        <Route path={ROUTES.DOCUMENTS} element={withSuspense(DocumentsPage)} />
        <Route path={ROUTES.DELETE_ACCOUNT} element={withSuspense(DeleteAccountPage)} />
      </Route>

      {/* ── Fallback ───────────────────────────────────────────────────── */}
      <Route path="*" element={withSuspense(NotFoundPage)} />
    </Routes>
  )
}

export default AppRoutes
