# Reproduced controlled UAT findings

## UAT-H1 — High — FIXED: immediate refresh returns 409

Layer: backend authentication. Reproduction: normal login for the disposable customer, then immediate `POST /api/v1/auth/refresh` with the issued HttpOnly refresh cookie. Observed HTTP 409: `A record with the same unique value already exists.` No tokens are included in this evidence.

Cause: refresh JWT payload/issuer/audience/expiry/iat were deterministic for the same session within one second. Rotation generated the same token hash as the existing unique `RefreshToken.tokenHash` row.

Narrow fix: `rentcar-backend/src/utils/jwt.js` adds a random JWT ID to every newly signed refresh token. Existing token verification remains compatible. No schema/migration or financial code changes.

Regression: fixed-clock issuance test failed before the patch and passes after it. Live MySQL check performed three immediate rotations with distinct cookies, all successful. Full backend regression: 46 suites, 273 tests PASS.

## UAT-M1 — Moderate — FIXED: address country input does not match storage contract

Layers: customer address form and existing backend storage contract. Reproduction: `POST /api/v1/addresses` with `{ addressLine1: "UAT Address ...", city: "UAT City", country: "India", addressType: "other" }`. The frontend and backend validators accepted this shape, but live MySQL returned HTTP 422: `The provided value is too long for the column.`

Cause: `Address.country` is `VARCHAR(2)`, while the customer form requested a country name and allowed 255 characters. Related existing storage limits are city/state 100 and postalCode 20.

Narrow fix: the form requests a two-letter country code, validates and uppercases it, and aligns field lengths with the existing schema. Backend source/schema unchanged for this finding. Country names are not silently guessed or truncated.

Regression: live browser rejected `India` with field-level guidance, then saved `in` as `IN`; authenticated GET confirmed persistence. Address create/read/update/delete and cross-customer denial passed. No leftover test address.

## Open findings

Critical: 0. High: 0. Moderate: 0. Low: 1 existing maintenance item (customer frontend's 33 baseline lint warnings/optional legacy code).

Environment limitations are not code findings: designated admin/vendor session unavailable, sole discoverable car lacks active pricing, Razorpay TEST/webhook configuration absent. These prevent full-system signoff despite the executed customer and regression checks passing.
