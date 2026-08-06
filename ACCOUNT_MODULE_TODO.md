# Customer Dashboard & Account Management — Task Checklist

## 1. Constants

- [ ] Extend `src/constants/routes.js` with account route paths
- [ ] Extend `src/constants/queryKeys.js` with new domain keys

## 2. Services (placeholder Promise APIs)

- [ ] dashboardService.js
- [ ] profileService.js
- [ ] walletService.js
- [ ] tripService.js (extend)
- [ ] notificationService.js
- [ ] supportService.js (extend)
- [ ] settingsService.js
- [ ] securityService.js
- [ ] kycService.js
- [ ] documentService.js
- [ ] reviewService.js
- [ ] referralService.js
- [ ] rewardService.js
- [ ] addressService.js
- [ ] Register all in modules/index.js

## 3. Redux Slices

- [ ] dashboardSlice.js
- [ ] profileSlice.js
- [ ] walletSlice.js
- [ ] supportSlice.js
- [ ] settingsSlice.js
- [ ] Register in store/index.js and redux/index.js

## 4. Reusable Account Components (src/components/account/)

- [ ] All ~24 components + barrel

## 5. Feature Modules (src/features/)

- [ ] dashboard, profile, kyc, wallet, bookings, trips, wishlist, notifications, reviews, support, referral, rewards, settings, security, documents

## 6. Pages (src/pages/account/)

- [ ] All 25 pages

## 7. Routing & Layout

- [ ] Update routes/index.jsx
- [ ] DashboardLayout / Sidebar navigation

## 8. Verification

- [ ] npm run build
