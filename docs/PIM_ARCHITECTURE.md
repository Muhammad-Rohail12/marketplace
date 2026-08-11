# Product Information Management (PIM) Foundation

## Models
- `AttributeGroup` → `Attribute` (many) → `AttributeValue` (many)
- `CategoryAttribute` — join table: which attributes apply to which category, with per-category required/order overrides
- `MeasurementUnit` — shared WEIGHT/DIMENSION/VOLUME/COUNT units
- `VariantOption` — one (attribute, attributeValue) pairing, e.g. Color=Red
- `VariantCombination` + `VariantCombinationOption` — a named set of VariantOptions (e.g. "Red / Small"); `productId` is nullable, reserved for a future Product FK
- `ProductSpecificationTemplate` + `SpecificationTemplateItem` — reusable spec sheets, optionally category-scoped, items grouped GENERAL/TECHNICAL
- `SKUConfiguration`, `BarcodeConfiguration` — naming-pattern metadata only, no generation logic yet

## Attribute Types
TEXT, NUMBER, DECIMAL, BOOLEAN, COLOR, SIZE, DROPDOWN, MULTISELECT, DATE, MEASUREMENT, URL, RICH_TEXT, IMAGE_REFERENCE — COLOR/SIZE/DROPDOWN/MULTISELECT use `AttributeValue` rows; others store raw values on the future Product/variant record.

## API
All under `/api/pim/*` — see the API Contract table in the Phase 19 implementation notes.

## Admin UI
Single tabbed page at `/admin/attributes`: Attribute Groups, Attributes (with inline value management), Measurement Units, Variants (option + combination builder), Specification Templates, SKU/Barcode Config.

## Public Components (foundation, not yet integrated)
`AttributeSelector`, `ColorSwatchSelector`, `SizeSelector`, `VariantPicker`, `SpecificationTable`, `TechnicalSpecificationSection`, `ComparisonAttributeCard` — all in `frontend/src/components/pim/`, ready to receive real product data once Products exist.

## Future Product Integration
- `Product.attributeId` values → validated against `CategoryAttribute` for that product's category
- `Product` variants → real `VariantCombination.productId` FK populated
- Filters/search → `Attribute.isFilterable` flags drive faceted search UI