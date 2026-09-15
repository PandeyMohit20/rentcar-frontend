# GST registration implementation report

**READY FOR GST REGISTRATION STATUS DECISION** — not production ready.

## Impact report and root cause

The pre-implementation audit found an unconditional GSTIN requirement in vendor tax policy, a fallback to the vendor's separate GSTIN in invoice snapshot construction, a registered-only tax calculator, and an unconditional TAX INVOICE/PDF GST breakdown. The DBRE identity is stored configuration in the pending issuer Setting, not a hardcoded calculation identity. It is not automatically reused by the new policy input.

Data path inspected: approval Setting/AuditLog → Vendor.taxProfile and CarPricing → signed quote financial/billing snapshots → Booking → stored Payment amount and Razorpay minor units → immutable Invoice snapshot/PDF → cancellation and full-payment refund. Customer and admin tax displays and their tests were also inspected before implementation.

## Schema and migration

Added strict conditional policy validation for explicit REGISTERED/UNREGISTERED in the existing JSON model. No SQL migration, live record update, status inference, GSTIN removal, auto-approval or rate autofill occurred. Missing status now requires a new explicit policy review. Financial snapshot v2 carries registration status; historical v1 invoices retain their existing validation/rendering contract. Existing bookings and amounts remain unchanged.

See [the backend policy and migration/operations guide](../../rentcar-backend/docs/gst-registration-policy.md) for the exact conditional fields, compatibility boundary, document approval requirements and supported CESS treatment.

## Files changed in this increment

Backend:

- New `src/modules/pricing/taxPolicy.js`: conditional schemas and authoritative vehicle-policy selection.
- `src/modules/pricing/tax.js`: explicit unregistered noncollection financial snapshots; registered arithmetic retained.
- `src/modules/billingApproval/service.js`: registration-aware readiness, old/new status audit, new version on status changes, policy-edit reopening of approval, stale receipt protection.
- `src/modules/bookings/service.js`: reject newly submitted incompatible/legacy confirmed quotes and reopened global approvals.
- `src/modules/invoices/snapshot.js`: explicit issuer registration/document metadata; remove vendor-GSTIN fallback.
- `src/modules/invoices/pdf.js`: conditional document/title/tax rendering and validation; retain historical registered behavior.
- `scripts/configure-tax-policy.js`: retire unaudited direct DB writing; route operators to authenticated admin workflow.
- New `tests/gst-registration.test.js`; updated registered fixtures in `tests/tax-snapshot.test.js`, `tests/helpers/phase7.js`, `tests/billing-approval.test.js` without deleting existing tests.
- New `docs/gst-registration-policy.md`; updated `docs/billing-approval-workflow.md`.

Admin:

- `src/pages/pricing/PricingApprovals.jsx`: explicit registration selector, conditional GSTIN, unregistered warning, status-change summary, editing after approval with mandatory renewed review.
- `src/utils/billingApproval.js`: require explicit status; reject contradictory JSON and retained GSTIN rather than silently converting.
- `src/pages/bookings/FinancialDocuments.jsx`, `src/pages/bookings/BookingDetails.jsx`: registration-aware tax presentation.
- `tests/billing-approval.test.mjs`, `tests/approval-browser.mjs`: conditional input and browser coverage.
- `docs/PRICING-APPROVAL-OPERATIONS.md`: updated policy guidance.

Customer frontend:

- New `src/utils/pricingPresentation.js`: customer-safe pricing errors and explicit presentation modes.
- `src/services/modules/pricingService.js`: preserve financialSnapshot (previously omitted by normalization), map customer error messages while retaining diagnostic codes.
- `src/components/booking/QuotePriceBreakdown.jsx`: display authoritative additional charges when present.
- `src/features/invoice/TaxBreakdown.jsx`, `InvoicePreview.jsx`, `InvoiceDownload.jsx`: no fake zero tax rows for unregistered seller, approved document title, safe download-unavailable copy.
- New `tests/gst-presentation.test.js` and `scripts/gst-ui-check.mjs`; `package.json` includes the additional tests.
- This report and `docs/LIVE-CARONRENT-UAT.md`.

Existing unrelated redesign and previous integration changes remain uncommitted and were preserved. No routes or components were removed; customer quote request shape and authentication flow remain unchanged. No frontend tax calculation was added.

## Amounts, invoices and auditing

Registered GST/recipient logic and rounding are preserved. Unregistered is a distinct domain state with `NOT_COLLECTED`, no GST percentage, and an internal zero tax total solely for existing ledger arithmetic. It is not registered GST at 0%. Nonzero registered CESS remains unsupported; unregistered CESS requires explicit supported noncollection, not an inferred zero.

Unregistered invoice/receipt title and its approval reference must be supplied by the business. Missing/contradictory policy or document fields block configuration/PDF generation. No invented legal title or GSTIN is substituted. Rental, approved non-tax charges, refundable deposit, customer/booking/payment details and total remain.

Status/policy changes record actor, timestamp, old/new status, policy version, approval reference and exact review/profile hashes. They reopen global approval atomically. Existing invoices retain their immutable historical content. Old completion keys and incompatible new booking attempts cannot silently reuse the former approval.

## Validation

All results below are **local code tests / isolated component tests**, not live business approval or payment evidence.

- Backend full suite: **53 suites, 373 tests passed**; includes 23 new registration-policy/lifecycle tests. Changed backend modules also passed targeted ESLint.
- Registered regressions: existing tax split, IGST/CGST-SGST, rounding, recipient place-of-supply, CESS, snapshots, invoice and payment/refund suites retained.
- Unregistered: conditional schema/GSTIN, explicit status, missing approvals, no GST arithmetic, document validation/PDF text, readiness, both registration-change directions, stale version/review, trusted quote → booking → payment order → capture → invoice → full refund amounts.
- Existing DB-backed HTTP authorization tests continue denying unauthenticated/CUSTOMER/VENDOR/PLATFORM_ADMIN and permitting valid SUPER_ADMIN completion in the test store.
- Admin tests: 9 passed; lint and build passed. Isolated browser checks cover registration choices, conditional GSTIN, warning, confirmations and dialog at 390/768/1024/1440 px.
- Customer tests: 12 passed; lint 0 errors with 33 existing warnings; build passed. Isolated quote/invoice browser checks cover REGISTERED and UNREGISTERED at all four widths, displayed trusted totals, and absence of fake/raw tax rows/codes.

## Live safety and remaining work

No live database writes, status changes, GSTIN edits, policy installations, approvals, bookings, payments or refunds. No live journey was attempted. Browser harnesses use labelled local fixture data and are removed from the served root after tests.

The authorized SUPER_ADMIN must decide actual seller registration, issuer identity, supported GST/CESS policy, commercial values, document title/mandatory fields and approval references. Then a fresh review and final completion are required before real-backend journey UAT can resume. Unsupported business/document requirements must remain blocked rather than being guessed.
