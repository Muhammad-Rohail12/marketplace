# Product Media Management

## Architecture
Seller → Product → MediaService → StorageProvider (interface) → LocalStorageProvider (today)
→ CloudinaryStorageProvider (future)
→ S3StorageProvider (future)
`media/storage/StorageProvider.js` defines the contract (`upload`, `delete`, `getUrl`, `exists`, `replace`). Swapping providers means writing one new file + changing `MEDIA_STORAGE_DRIVER` — zero changes to `media.service.js`, controllers, or `Product` logic.

## Database
`ProductMedia` — belongs to `Product`, optionally to a `VariantCombination`. `isPrimary` (exactly one true per product, transactionally enforced), `sortOrder` (persisted, not upload-time-derived), `status` (ACTIVE/DELETED — soft delete, storage file also physically removed).

## Upload Validation
1. Multer buffers the file in memory (never touches disk yet)
2. `file-type` sniffs actual magic bytes — rejects mismatched/fake extensions
3. `image-size` reads real dimensions — rejects sub-400×400px images
4. Only after both pass does `StorageProvider.upload()` write to disk

## Primary Image Logic
Set via transaction: unset old primary → set new primary, atomically. On delete of the primary image, the next-lowest-`sortOrder` remaining image is automatically promoted, also transactionally.

## Variant Media
`ProductMedia.variantId` (nullable) — when set, the gallery (`ProductGallery.jsx`) filters to that variant's images when a variant is selected, falling back to the full product gallery otherwise.

## Gallery Components
`ProductGallery` (orchestrator) → `ProductThumbnailList` + `ProductMainImage` (which conditionally renders `ImageMagnifier` on desktop hover, or opens `ImageZoomViewer` lightbox on click/mobile tap). Lightbox supports Escape, arrow-key navigation, and touch taps.

## API
See the API Contract table in the Phase 23 implementation notes.

## Future Compatibility
`MediaType` enum already includes `VIDEO_PLACEHOLDER`, `THREE_D_MODEL_PLACEHOLDER`, `VIEW_360_PLACEHOLDER` — schema-ready, no business logic implemented for them yet, exactly per spec.

## Testing
See Testing Steps in the Phase 23 implementation notes.
