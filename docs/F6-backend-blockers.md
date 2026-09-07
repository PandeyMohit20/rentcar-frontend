# F6 backend blockers (read-only findings)

> Historical F6 findings. B1 and B2 are resolved by the user's subsequent backend changes. Current source includes captured-money checks under the shared lock and the safe `booking.payment` association. The frontend now integrates B2. See [F6-rerun-report.md](F6-rerun-report.md) for current validation and decisions. The original evidence below is retained as history, not active backlog. Backend race/suite results are user-supplied evidence, not tests rerun by the frontend agent.

## CRITICAL B1: captured review payment can be followed by a second order

- Route: `POST /api/v1/payments/orders`.
- Path: `src/modules/payments/service.js:17`, `createOrder()` calls `payable()` and `activeAttempt()` before creating a payment.
- `payable()` (line 15) checks only booking status/paymentStatus/hold expiry. `activeAttempt()` (line 16) considers only `pending` and `processing` payment rows.
- Captured-payment reconciliation at lines 46–49 can write payment `status=succeeded`, `operationalStatus=review_required` or `late_payment_conflict` without changing the pending booking's financial state. While the hold remains valid, another createOrder request can therefore create another payment/order. This is a source-proven path; no real charge or fabricated webhook was used to reproduce it.
- Impact: possible second payment after money has already been received. Frontend guards cannot close the server-side invariant across tabs/devices/clients.
- Minimal proposed fix: under the existing booking lock, re-read booking/payment truth and reject new orders whenever a captured payment or unresolved operational review exists for the booking. Verify with real database concurrency and provider-test integration checks. Do not merely add a client flag.
- Backend was not patched.

## HIGH B2: fresh-session payment operational status cannot be recovered from a booking

- Routes: `GET /api/v1/bookings/:bookingId` and `GET /api/v1/payments/:paymentId`.
- Path: `src/modules/bookings/service.js:16` `dto()` and line 21 `getMine()` return booking/paymentStatus but no payment ID or operational status. The payment GET requires an already-known payment ID.
- Frontend path: `src/pages/BookingStatus/index.jsx` initializes paymentId solely from same-tab recovery. A fresh tab, cleared storage or a different recovered booking loses the association. Creating an order is not a safe substitute for a read.
- Impact: under-review/late-conflict explanation and no-second-payment warning cannot reliably be reconstructed from the customer booking URL alone. Ordinary confirmed booking status remains readable.
- Minimal proposed fix: extend the existing ownership-checked booking read DTO with an authoritative safe payment summary/identifier and operational status. No financial/provider secrets should be included. Frontend can then read/reconcile the payment without a write.
- Backend was not patched; this contract extension is proposed only.

These blockers are separate from the six known backend backlog items in the F6 request. Pickup concurrency remains Beta and was not changed or exposed.
