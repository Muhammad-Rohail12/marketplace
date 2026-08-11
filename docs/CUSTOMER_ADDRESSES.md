# Customer Address & Delivery Management (USA)

## Architecture
User → Address[] (US format: line1/line2, city, stateCode, ZIP, phone, label, isDefault)
↓
Cart.selectedAddressId (nullable FK)
## US Address Format
firstName, lastName, companyName (optional), addressLine1, addressLine2 (optional — apt/suite/unit), city, stateCode + stateName, postalCode (5-digit or ZIP+4), countryCode (pinned to `US` this phase), phone (normalized to `+1XXXXXXXXXX`), deliveryInstructions (optional, sanitized), label (HOME/WORK/OTHER).

## US States
Single source of truth: `backend/src/address/constants/usStates.constants.js` (50 states + DC + PR), mirrored in `frontend/src/constants/usStates.js` for dropdown population without a network call. Backend validates every `stateCode` against this list.

## Default Address Logic
- First address a user creates is **automatically** default.
- Explicitly setting a new default, or creating a new address with `isDefault: true`, atomically unsets any prior default in the same transaction.
- Deleting the current default **auto-promotes** the next most-recently-created remaining address to default (documented choice — never leaves the user defaultless if any address remains).

## Cart Integration
`PATCH /api/cart/delivery-address` re-verifies address ownership server-side before attaching it to the user's active cart. Deleting a selected address transactionally clears the cart's reference — no broken FK. `POST /api/cart/validate` (Phase 26) now also checks a delivery address is selected, without calculating shipping/tax (out of scope for this phase).

## Order Address Snapshot (Future)
This phase's `Address` rows are mutable and reusable across multiple future orders. A future Order system MUST NOT reference `Address.id` directly for historical display — it must copy the address fields into an immutable `OrderAddress`-style snapshot at order-creation time, so a later edit to a saved address never rewrites history. Not implemented in this phase; documented here as a hard requirement for Phase 28+.

## Security
See Security Notes in the Phase 27 implementation notes — IDOR protection, mass-assignment prevention, XSS sanitization, transactional default-switching, cart-reference cleanup.

## Testing
See Testing Steps in the Phase 27 implementation notes.