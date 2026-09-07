# RENTCAR CONTROLLED FULL-SYSTEM UAT REPORT

2026-09-07. Overall: **PARTIAL — ENVIRONMENT BLOCKED**. This report distinguishes real API/MySQL/browser evidence from prior isolated validation and automated mocked-database coverage. No provider success, privileged account, priced quote or paid booking is fabricated. A binary FAIL below for an unavailable mandatory gate means signoff evidence is missing, not a newly reproduced code defect.

## 1. Executive Verdict

| Area | Result |
| --- | --- |
| Customer discovery | PARTIAL — live APIs and public browser actions pass; dataset has one unpriced car |
| Trusted quote | PARTIAL — real 404, no active pricing |
| Booking | PARTIAL — real authenticated empty reads; no creation fixture |
| Razorpay TEST payment | NOT EXECUTED |
| Payment recovery | FAIL — live financial recovery gate unavailable; prior F6 isolated B2 PASS remains supporting evidence |
| My Bookings | PASS — real authenticated empty list/UI; populated listing untested |
| Booking detail | FAIL — no owned UAT booking to validate live |
| Cancellation | PARTIAL — automated/source evidence only; live unexecuted |
| Refund | NOT EXECUTED live |
| Invoice | PARTIAL — automated/source evidence only; live unexecuted |
| Profile | PASS — real persistence and browser hard refresh |
| Addresses | PASS — live CRUD, browser edit, ownership and cleanup |
| Customer KYC | PARTIAL — live upload/download/delete/ownership; submit/review unexecuted |
| Admin KYC | PARTIAL — privileged session unavailable |
| Vendor KYC | PARTIAL — vendor/admin fixture unavailable |
| Admin Fleet | PARTIAL — admin build/guest surface checked; privileged operations unavailable |
| Admin Booking | FAIL — mandatory live visibility gate unavailable |
| Vendor Booking | PARTIAL — no authorized vendor-member fixture |
| Authorization | PARTIAL — live customer/admin and address/KYC ownership checks pass |
| Cross-surface consistency | PARTIAL — customer/API/MySQL account state verified; fleet/financial chain unavailable |
| Responsive | PARTIAL — live customer account and admin guest samples pass |

Critical findings: **0 open**. High: **0 open (1 fixed)**. Moderate: **0 open (1 fixed)**. Low: **1 existing maintenance item**.

Backend changed: **YES** — refresh JWT uniqueness and regression test only. Frontend changed: **YES** — address form contract fix plus UAT scripts/evidence. Admin changed: **NO**.

CODE PRODUCTION-READY: **YES for the audited scope after fixes**, subject to unexecuted gates below; not a whole-system release approval. FULL FINANCIAL UAT COMPLETE: **NO**. FULL-SYSTEM UAT COMPLETE: **NO**.

## 2. Environment

Frontend: localhost:5173, API `http://localhost:5000/api/v1`. Admin: started on localhost:5174 with explicit local API override; no env file committed. Backend: development on localhost:5000. Temporary second backend on 5001 used the same source and MySQL with local SMTP overrides; stopped afterward. Database: local MySQL `rentcar`, reachable; six migrations, up to date.

Razorpay: key/secret absent in inspected setup; no TEST or live provider call made. Webhook: secret/forwarding unavailable; reachability untested. Browsers: disposable headless Chrome profiles; no personal browser session used. Both frontend/admin origins returned matching allowed CORS origins. Production API placeholder remains a deployment requirement, not a dev-UAT failure.

## 3. UAT Fixtures

Fixture plan was saved before creating records: [UAT-fixture-plan.md](UAT-fixture-plan.md). Exact IDs and cleanup: [UAT-fixture-ledger.json](UAT-fixture-ledger.json).

- Customer A: `d6399717-01d5-49bb-b35a-3b1725c8cfd6`.
- Customer B: `6df4a60b-a093-4abf-aa09-be53411af4e1`.
- Labels: UAT Customer A/B `uat-1788798058450`; synthetic `@example.test` emails.
- Vendor/VendorMember: not created; no usable admin session.
- Existing branch inspected, unchanged: `d5f9c996-6a74-47d0-b2e3-2a75688486a9`.
- Existing car inspected, unchanged: `dc96154a-7035-481b-b335-8fccb6f4d310`.
- Pricing: no active record; no unauthorized fixture/DB insertion.
- Interval: 2026-09-10T16:28:43.841Z to 2026-09-11T16:28:43.843Z.
- KYC: generated PDF containing `TEST DOCUMENT - NOT A REAL ID`; expiry 2030-12-31.
- Cleanup: address `9f216c23-0f93-4c06-9fb3-5770b7320feb` and KYC document `4a01a85f-d9f9-437c-b4ce-7e0425b60a9f` deleted; both profiles restored; all sessions revoked. Labelled accounts/audit history retained. Credentials/OTPs remained in process memory; reruns reused the accounts through normal password-reset APIs.

## 4. Customer Discovery

Locations: branch load 200. Availability: real POST returned the existing car for the test interval. Filters: mobile Apply/Clear retained trip parameters; pagination depth unavailable with one car. Car detail: 200 and real quote error shown. Timezone: trip parameters preserved and customer account displays retain the existing Asia/Kolkata formatter; paid-booking/admin timezone comparison unavailable.

Evidence: [UAT-public-evidence.json](UAT-public-evidence.json), plus the existing dependency-free public browser script run with `--actions-only` against live responses.

## 5. Trusted Quote

Car: existing inspected ID above. Amount/deposit/currency/expiry: no authoritative successful quote available. `POST /pricing/quote` returned 404: `No active pricing record is available for this car.` Backend/frontend consistency: actual backend rejection displayed; no fake total. **PRICED FIXTURE UNAVAILABLE**.

## 6. Booking

Booking ID/number/status/hold: none created. Idempotency replay, BookingItem/history, admin visibility and vendor visibility: live NOT EXECUTED without a priced fixture/privileged account. Existing backend automated booking coverage passed; it is supporting evidence only.

## 7. Payment

Payment ID/provider order: none created. Mode: no configured TEST environment. Checkout/Verify/Webhook/final payment/operational status: NOT EXECUTED. Second-charge check: prior supplied real-race evidence and current automated B1 coverage remain supporting evidence; no fresh provider test was performed.

## 8. Recovery

Same-tab hard refresh: live authenticated Profile PASS. Fresh tab, cleared recovery storage, direct paid-booking URL and B2 payment association after payment: live NOT EXECUTED without a paid fixture. Prior F6-RERUN's isolated B2 scenarios passed; not relabelled as full-system/live payment evidence.

## 9. Post-Booking

My Bookings: two real customer lists empty; authenticated page rendered. Detail: owned booking unavailable. Cancellation, refund and invoice: no live operation/read of a real paid UAT artifact. No financial history was deleted or altered for cleanup.

## 10. Profile / Addresses

Profile persistence: PATCH a safe bio, independent GET, browser display and hard refresh all passed; original null bio restored. Address create: real API record persisted. Update: API update displayed in browser; browser country edit persisted `IN`. Delete: API delete and subsequent empty list passed. Cross-customer read: 403. Cleanup: zero addresses, confirmed through read-only MySQL.

## 11. Customer KYC

Status: real unverified account. Licence upload: synthetic PDF accepted with required future expiry. Download: exact uploaded bytes returned to owner. Other customer: 404; unauthenticated download: 401. Delete: pending document removed; empty list and DB confirmed. Replace: not separately executed. Submit: not performed without a review fixture/session; no stranded submitted review created. Customer result: document visible in real UI before deletion, final account unverified with no documents.

## 12. Admin KYC

Customer review/document review/aggregate review/customer reflected decision: NOT EXECUTED; designated privileged account unavailable. Real customer request to admin KYC was rejected with 403.

## 13. Vendor KYC

Vendor/membership/document review/aggregate review/tenant isolation: live NOT EXECUTED. No real vendor documents used. Automated vendor-KYC coverage passed separately.

## 14. Fleet Integration

Car: public existing car inspected, no production/disposable classification assumed for writes. Images/documents/features/pricing mutations/availability block/status changes: NOT EXECUTED without authorized admin fixture. Public effect: real availability succeeds but quote fails for missing pricing. No existing fleet data changed.

## 15. Booking Operations

Admin list/detail and vendor list/detail: NOT EXECUTED with privileged accounts. Customer request to admin booking list: 403. Pickup beta: NOT EXECUTED; **PICKUP BETA — NOT PRODUCTION HARD-CLOSED**. Return flow not executed.

## 16. Authorization

Customer/admin: booking and KYC admin APIs deny customer with 403. Cross-customer: A's address denies B; A's KYC download denies B. KYC ownership: owner download succeeds, unauthenticated 401. Cross-vendor, real payment ownership, real booking ownership and restricted-admin permission matrix: not executed without fixtures/accounts. No privileged role/token was fabricated.

## 17. Cross-Surface Consistency

Quote → Booking, Booking → Payment, Payment → Invoice, Customer → Admin, Fleet pricing → Customer quote, Fleet block → Customer availability: NOT EXECUTED end to end. Customer Profile/Address/KYC ↔ real API ↔ MySQL persistence/cleanup: PASS. [Read-only database evidence](UAT-database-evidence.json).

## 18. Security / Privacy

Storage: executed customer browser flow retained none of the tested passwords/access tokens/quote tokens/signatures/provider payloads/private blob references. Refresh cookie was HttpOnly and cleared at logout; prior API refresh lifecycle rejected after logout. URLs/logs: test evidence stores sanitized route/status data, not auth/provider secrets. Provider secrets: none used/exposed. Card boundary: no card data entered. KYC: synthetic only, protected download, document deleted. Leaks: none found in executed flows; authenticated admin storage/financial flows remain untested.

## 19. Responsive / Accessibility

Customer mobile/desktop: Profile, Addresses, KYC and empty My Bookings at 375/768/1440, no horizontal overflow; screenshots inspected. Admin mobile/desktop: login only at 375/1440, no overflow. Dialogs: real address validation/save exercised. Keyboard/focus: public filter Escape and focus restoration passed. Issues: no unresolved visual issue found in samples. Full screen-reader/keyboard audit and physical devices unavailable.

## 20. Runtime / Network

Console exceptions: zero in the 21-check successful live customer run and admin guest samples. CORS: both origins accepted; real browser customer requests worked. Refresh loops: immediate-rotation collision fixed, three successive rotations pass. Duplicate requests: no booking/payment/cancellation POST issued; no duplicate financial operation. Polling: live financial polling untested. Stale APIs: none observed in executed customer critical requests. Expected unauthenticated 401s and missing-pricing 404 are recorded separately from runtime errors.

## 21. Verification

| Verification | Result |
| --- | --- |
| Frontend build | PASS after address fix |
| Frontend lint | 0 errors, 33 baseline warnings |
| Admin build | PASS |
| Admin lint | PASS, 0 reported issues |
| Backend tests | 46 suites, 273 tests PASS after JWT fix |
| Backend lint | PASS |
| Prisma validate | PASS |
| Migrate status | Six migrations; schema up to date |
| Health | GET /api/v1/health 200 UP |
| Git diff checks | PASS across all three repositories |

No schema change, migration execution, DB reset or direct DB fixture mutation. Heavy financial race harnesses were not rerun because the code patch is isolated to refresh-token signing; full backend regression was rerun. Existing F6 implementation was preserved.

## 22. Findings

### Critical

0 open.

### High

0 open. **UAT-H1 fixed:** immediate refresh JWT collision caused real HTTP 409. Unique JWT ID added. Fixed-clock test failed before the patch; live immediate rotations and 273-test regression pass afterward.

### Moderate

0 open. **UAT-M1 fixed:** country-name address input exceeded existing two-character DB country column. Narrow form validation/label/length alignment; live browser invalid-name rejection and normalized-code save pass.

### Low

1 existing maintenance item: 33 customer lint warnings and optional legacy code. No new warning introduced. Exact reproduction and patch scope: [UAT-findings.md](UAT-findings.md).

## 23. Environment Limitations

No usable admin credentials/session location was supplied after the setup request. Therefore no legitimate vendor/branch/car/pricing fixture could be created through admin APIs. Sole discoverable car lacks pricing. Razorpay TEST key/secret and webhook setup are absent. These block the required full-system/financial gates and are not counted as Critical/High code findings. Staging deployment must supply the real production API URL. No physical-device evidence.

## 24. Remaining Known Backlog

Location persistence: REMAINS. Customer rich booking summary: REMAINS. KYC expiry scheduler: REMAINS. KYC replacement atomicity: REMAINS. Concurrent same-type KYC upload: REMAINS. Pickup concurrency closure: REMAINS.

Cancellation/capture race is not reopened as backlog.

## 25. Final Decision

CONTROLLED FULL-SYSTEM UAT COMPLETE: **NO**.

CODE PRODUCTION-READY: **YES for audited scope after the two narrow fixes**; full-system acceptance is pending.

FULL LIVE FINANCIAL UAT COMPLETE: **NO**.

SAFE FOR STAGING RELEASE: **NO — required UAT gates remain unvalidated**.

RECOMMENDED NEXT: supply the designated local admin session and Razorpay TEST/webhook setup, create a legitimate priced UAT car through admin APIs, then complete the remaining privileged/booking/financial gates. Staging release preparation was not started.
