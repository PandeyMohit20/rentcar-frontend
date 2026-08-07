# Customer Dashboard & Account Management — Task Checklist

## 1. Constants

- [x] Extend `src/constants/routes.js` with account route paths
- [x] Extend `src/constants/queryKeys.js` with new domain keys

## 2. Services (placeholder Promise APIs)

- [x] dashboardService.js
- [x] profileService.js
- [x] walletService.js
- [x] tripService.js (extend)
- [x] notificationService.js
- [x] supportService.js (extend)
- [x] settingsService.js
- [x] securityService.js
- [x] kycService.js
- [x] documentService.js
- [x] reviewService.js
- [x] referralService.js
- [x] rewardService.js
- [x] addressService.js
- [x] Register all in modules/index.js

## 3. Redux Slices

- [x] dashboardSlice.js
- [x] profileSlice.js
- [x] walletSlice.js
- [x] supportSlice.js
- [x] settingsSlice.js
- [x] Register in store/index.js and redux/index.js

## 4. Reusable Account Components (src/components/account/)

- [x] All components + barrel (navigation.jsx, AccountPageShell, UserAvatar, ProfileCard, DashboardLayout, Sidebar, Topbar, WalletCard, TransactionTable, ProfileForm, KYCStatus, DocumentUploader, DrivingLicenseCard, TripCard, TripTimeline, WishlistCard, NotificationCard, SupportTicketCard, ReviewCard, RewardCard, ReferralCard, SecurityCard, DeviceCard, AddressCard, SettingsPanel, PrivacyPanel, DashboardWidget, BookingTable, DeleteAccountDialog)

## 5. Feature Modules (src/features/)

- [x] dashboard, profile, kyc, wallet, bookings, trips, wishlist, notifications, reviews, support, referral, rewards, settings, security, documents, addresses, account (constants)

## 6. Pages (src/pages/account/)

- [x] All 25 pages (Dashboard, Profile, EditProfile, KYC, DrivingLicense, Wallet, WalletHistory, Bookings, BookingDetails, Trips, TripDetails, SavedAddresses, AccountWishlist, Notifications, Reviews, Support, CreateTicket, TicketDetails, Referral, Rewards, Settings, Privacy, Security, Devices, Documents, DeleteAccount)

## 7. Routing & Layout

- [x] Update routes/index.jsx
- [x] DashboardLayout / Sidebar navigation
- [x] `navigation.js` renamed to `navigation.jsx` (JSX in a `.js` file blocked Vite build)
- [x] `formatDate` re-exported from `@/utils/formatters` via `@/utils/date`

## 8. Verification

- [x] npm run build — no errors
