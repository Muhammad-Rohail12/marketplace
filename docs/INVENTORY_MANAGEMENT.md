# Inventory & Stock Management

## Architecture
Seller → Store → Product → (optional) VariantCombination → Inventory → StockMovement[]
One `Inventory` row per simple product (`variantId: null`, uniqueness enforced at service layer) or per variant (`variantId` unique-constrained at the DB level).

## Quantity Model
`availableQuantity = quantity - reservedQuantity` — always computed on read (`withAvailable()`), never stored, eliminating a class of consistency bugs.

## Status Calculation (single source of truth)
`inventory.service.js: calculateStatus()` — the only place status logic lives. Called from every mutation path. `available <= 0` → OUT_OF_STOCK (or BACKORDER if enabled); `available <= lowStockThreshold` → LOW_STOCK; else IN_STOCK.

## Concurrency Strategy
Optimistic concurrency via `Inventory.version` + conditional `updateMany({ where: { id, version } })`. On a lost race (0 rows updated), the operation retries (up to 5 attempts) against freshly-read data rather than failing outright — this correctly serializes concurrent adjustments without heavy row-level locking.

## Stock Movement Types
`INITIAL_STOCK`, `RESTOCK`, `MANUAL_ADJUSTMENT`, `DAMAGE`, `LOSS`, `CORRECTION` are seller-triggerable. `RESERVATION`, `RELEASE`, `SALE`, `RETURN` are reserved for the future Order system (service functions exist: `reserveStock`, `releaseStock`, `consumeStock`, `restoreStock` — no route exposes them yet).

## API
See the API Contract table in the Phase 24 implementation notes.

## Public Availability
Coarse status + label only (`In Stock` / `Only a few left` / `Out of Stock` / etc.) — exact quantities never exposed publicly.

## Security
See Security Notes in the Phase 24 implementation notes — IDOR protection, concurrency safety, negative-stock prevention, seller-triggerable-type restriction, input ceilings.

## Future Order Integration
`reserveStock(inventoryId, qty)` → cart add. `releaseStock` → cart remove/expiry. `consumeStock` → order finalized. `restoreStock` → order cancelled/returned. All four already handle concurrency and status recalculation identically to seller-facing operations.

## Testing
See Testing Steps in the Phase 24 implementation notes — the concurrency test (step 12) is the most architecturally important one.