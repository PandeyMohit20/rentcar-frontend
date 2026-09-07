# F6 source contract audit

F6-RERUN addendum: the ownership-checked `GET /bookings/:bookingId` now adds safe `payment` (`id`, `status`, `operationalStatus`, `amount`, `currencyCode`, `createdAt`, `updatedAt`) or `null`. Both booking detail service methods preserve it without lossy normalization. Booking Status selects its payment query from this association, reconciles old local metadata, and refetches booking/payment after order 409. See [the rerun report](F6-rerun-report.md). Historical rows below describe the original F6 audit.

Audited 2026-09-07 against the sibling `rentcar-backend/src/routes/index.js`, module routes, validators, controllers and relevant services. Backend files are read-only. Paths below are relative to `/api/v1` on both sides. This matrix records source compatibility, not authenticated runtime PASS.

| Frontend method | HTTP | Frontend endpoint | Backend endpoint | Payload match | Response normalization | Status handling | Active consumer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| authService.login | POST | /auth/login | /auth/login | email, password | data.accessToken, data.user | Inline/toast rejection; session-version guard | Login |
| authService.register | POST | /auth/register | /auth/register | name, email, optional phone, password | Success then OTP | Validation/rejection | Register |
| authService.getMe | GET | /auth/me | /auth/me | No body | data.user | 401 single-flight refresh; offline retry | SessionBootstrap |
| refresh interceptor | POST | /auth/refresh | /auth/refresh | Empty body, cookie | data.accessToken | 401/403 expire; network/429/5xx preserve | Axios |
| authService.logout | POST | /auth/logout | /auth/logout | Empty body, bearer/cookie | Body ignored | Always clear local state | Shared LogoutButton in Navbar/account Sidebar |
| authService.forgotPassword | POST | /auth/forgot-password | /auth/forgot-password | email | Safe generic success | No mutation retry | ForgotPassword |
| authService.resetPassword | POST | /auth/reset-password | /auth/reset-password | token, newPassword | Body ignored | No mutation retry | ResetPassword |
| authService.verifyOtp | POST | /auth/verify-otp | /auth/verify-otp | email, email_verification purpose, otp | Body ignored | Validation/rate-limit feedback | VerifyEmail |
| authService.resendVerification | POST | /auth/resend-verification | /auth/resend-verification | email | Body ignored | Cooldown/rate-limit feedback | VerifyEmail |
| locationService.getCities | GET | /locations/cities | /locations/cities | limit <= 100 | data array -> items; meta | Query policy and retry surface | Locations |
| locationService.getBranches | GET | /locations/branches | /locations/branches | limit <= 100 | data array -> items; meta | Query policy and retry surface | Home/Search |
| carService.searchCars | GET | /cars/search | /cars/search | branchId, brand, fuelType, transmission, seatingCapacity, page, limit | public DTO allowlist -> cars; meta | No fake availability fallback | Search catalog |
| carService.getFeaturedCars | GET | /cars/featured | /cars/featured | No body | public DTO allowlist -> cars | Error/empty state | Home |
| carService.getCarDetails | GET | /cars/:id | /cars/:carId | UUID | data -> normalized car | Not found/retry | CarDetails |
| availabilityService.searchAvailability | POST | /availability/search | /availability/search | offset datetimes, branchId, brand, fuelType, transmission, seats, page, limit | data -> cars; meta | Read-only query policy; errors remain errors | Search availability |
| pricingService.createQuote | POST | /pricing/quote | /pricing/quote | carId, pickupDateTime, returnDateTime only | data allowlist; duration/pricing/expiry | No retry; clear failed quote | CarDetails |
| bookingService.createBooking | POST | /bookings | /bookings | quoteToken only; Idempotency-Key header | data booking (201 or replay 200) | Stable attempt; ambiguity guidance | CarDetails |
| bookingService.listMyBookings | GET | /bookings/me | /bookings/me | status enum, page, limit | data -> bookings; meta | Error/retry | My Bookings |
| bookingService.getBookingDetails/getBookingById | GET | /bookings/:id | /bookings/:bookingId | UUID | data booking | Ownership errors; bounded reconciliation | BookingDetail/BookingStatus |
| bookingService.cancelBooking | POST | /bookings/:id/cancel | /bookings/:bookingId/cancel | optional reason <= 500; Idempotency-Key | data.booking/refund | Refresh after success or uncertain failure | BookingDetail |
| paymentService.createOrder | POST | /payments/orders | /payments/orders | bookingId only | data.payment, data.keyId | No blind retries | BookingStatus |
| paymentService.verifyPayment | POST | /payments/verify | /payments/verify | bookingId + exact Razorpay order/payment/signature fields | Verification acknowledgement only | Re-read booking/payment; never infer confirmation | BookingStatus |
| paymentService.getPaymentById | GET | /payments/:id | /payments/:paymentId | UUID | data payment | Financial/operational states separate | BookingStatus |
| refundService.listForBooking | GET | /bookings/:id/refunds | /bookings/:bookingId/refunds | UUID | data array | Pending/processing bounded polling | BookingDetail |
| invoiceService.getForBooking | GET | /bookings/:id/invoice | /bookings/:bookingId/invoice | UUID | data structured invoice | 404 means not issued | BookingDetail/InvoicePreview |
| profileService.getAccount/updateAccount | GET/PATCH | /users/me | /users/me | name, email, nullable phone | data.user | Account inline validation; no write retry | Account shell/Profile |
| profileService.getProfile/updateProfile | GET/PATCH | /profiles/me | /profiles/me | nullable dateOfBirth, gender, bio | data.profile | Account inline validation; no write retry | Profile |
| addressService.listAddresses | GET | /addresses | /addresses | No body | data.addresses | Account error/empty state | Addresses |
| addressService.createAddress | POST | /addresses | /addresses | addressLine1/2, city, state, country, postalCode, addressType, isDefault | data.address | No retry; refresh uncertain writes | Addresses |
| addressService.updateAddress/deleteAddress | PATCH/DELETE | /addresses/:id | /addresses/:addressId | Same editable fields / no body | data.address / ignored | Ownership/validation errors | Addresses |
| kycService.getStatus/listDocuments | GET | /kyc/status; /kyc/documents | Same | No body | data status / array | Account error surfaces | Account shell/KYC |
| kycService.uploadDocument | POST | /kyc/documents | /kyc/documents | multipart file, documentType, issuedAt, expiresAt | data document | 413/422; uncertain result requires review | UploadDialog |
| kycService.downloadDocument | GET | /kyc/documents/:id/download | /kyc/documents/:documentId/download | Authenticated UUID request | Blob; safe filename; revoke object URL | Normalized errors; no private URL in UI | DocumentCard |
| kycService.deleteDocument | DELETE | /kyc/documents/:id | /kyc/documents/:documentId | No body | Ignored | Refresh; non-atomic replacement guidance | KYC/UploadDialog |
| kycService.submitKyc | POST | /kyc/submit | /kyc/submit | Empty body | data | No retry; current pending licence required | KYC |

Unmounted helpers: auth verifyEmail/sendOtp/refreshToken, location getLocations, refund getById, invoice getById have matching backend routes but no mounted consumer. Historical endpoint constants and legacy services are not evidence of active requests.

Cancellation DTO has no eligibility flag. The frontend gates using returned booking/payment status and startAt, matching `bookings/service.js` cancellation checks; the POST remains authoritative and may reject. Rich booking summaries and non-atomic KYC replacement remain known backend backlog.
