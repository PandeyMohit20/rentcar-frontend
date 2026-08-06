# Booking / Checkout / Payment / Reservation Module — Plan

## Objective

Build a production-ready, feature-based Booking → Checkout → Payment → Confirmation flow for RentCar, following the existing conventions (MUI, RHF + Zod, TanStack Query wrappers, Redux Toolkit, service abstraction, pageStyles). No backend wiring — all services are placeholder promises.

## Architecture (feature-first, SOLID)

### New Redux slices (`src/redux/slices/`)

- `bookingSlice.js` — extend existing draft/current booking + wizard step state (already exists; add step + reservation fields).
- `checkoutSlice.js` — billing details, insurance selection, add-ons, tax/price breakdown, terms acceptance.
- `paymentSlice.js` — payment method, split-payment, processing/success/failed status.
- `couponSlice.js` — applied coupon, available coupons, remove/validation placeholder.
- `tripSlice.js` — trip summary (car, pickup/drop, duration, distance/fuel placeholders, cost).

### New services (`src/services/modules/`)

- `checkoutService.js` — placeholder: `validateCheckout`, `submitCheckout`.
- `couponService.js` — placeholder: `listCoupons`, `applyCoupon`, `removeCoupon`, `validateCoupon`.
- `invoiceService.js` — placeholder: `getInvoice`, `downloadInvoice`.
- `tripService.js` — placeholder: `getTripSummary`, `estimateTrip`.
- Wire all into `src/services/modules/index.js` barrel.

### New constants (`src/constants/bookingOptions.js`)

- `INSURANCE_OPTIONS` (Basic, Premium, Zero Depreciation, Roadside Assistance)
- `ADDON_OPTIONS` (GPS, Child Seat, Fastag, WiFi, Extra Driver, Fuel Plan, Unlimited KM, Doorstep Delivery)
- `PAYMENT_METHODS` (Card, UPI, Net Banking, Wallet, Gift Card, Split)
- `PRICE_OPTIONS` (tax rates, platform fee, GST)

### New features (reusable components)

- `src/features/booking/` — BookingWizard, BookingStepper, TripDetails, PickupDetails, DropDetails, DriverDetails, AdditionalDriver, ContactDetails, EmergencyContact
- `src/features/checkout/` — BookingSummary, PriceSummary, TaxBreakdown, InsuranceOptions, AddOns, TermsAcceptance, CancellationPolicy
- `src/features/payment/` — PaymentMethod, PaymentCard, WalletPayment, UPIPayment, NetBanking, SuccessCard, FailureCard
- `src/features/coupon/` — CouponCard, CouponList
- `src/features/invoice/` — InvoicePreview
- `src/features/reservation/` — BookingConfirmation, TripTimeline
- `src/features/trip/` — TripSummary
- `src/components/booking/` — add LoadingOverlay (keeps existing BookingSummary, StickyBookingCard)

### New / updated pages (`src/pages/`)

- `Booking/` — full 5-step wizard (Dates/Locations → Driver → Insurance → Add-ons → Review)
- `Checkout/` — billing, summary, taxes, coupon, terms
- `Payment/` — method selection + processing/success/failed states
- `BookingConfirmation/` — confirmation with booking/payment status
- `BookingSuccess/`
- `BookingFailed/`
- `InvoicePreview/`
- `TripSummary/`

### Routes & constants

- Add route constants in `src/constants/routes.js`
- Lazy-load new pages in `src/routes/index.jsx`

## Validation

- Zod schemas for driver details, emergency contact, terms acceptance in `src/validators/bookingValidator.js`.

## Performance / A11y / Animation

- Lazy loading + Suspense, memoized components, ARIA labels, stepper transitions + framer-motion page transitions.

## Verification

- `npm run build` must pass with no errors.
