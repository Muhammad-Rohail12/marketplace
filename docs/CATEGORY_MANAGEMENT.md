# Enterprise Category Management

## Schema
`Category` model — self-referential via `parentId` (`CategoryHierarchy` relation), soft delete via `deletedAt`, `level` auto-computed from parent depth, `sortOrder` for manual ordering within a parent.

## Hierarchy Architecture
- Tree built in-memory from a flat list (`categoryTree.service.js: buildTree`) — O(n), avoids recursive SQL.
- `getAncestors` walks parentId chain upward; `getDescendantIds` walks downward via a parent→children map — both reused for breadcrumbs, circular-reference prevention, and cascading soft delete.
- Max depth (default 6) enforced on every create/reparent via `computeLevel`.

## API Endpoints
See the API Contract table in the Phase 17 implementation notes.

## Admin Workflow
`/admin/categories` — tree view with inline Edit/Delete/Restore actions, modal-based create/edit form supporting icon/image/banner upload and all toggles (active, featured, homepage, navigation) plus SEO fields.

## Frontend Components
`CategoryCard`, `CategoryGrid`, `CategoryCarousel`, `CategoryTree`, `CategoryNavMenu`, `CategoryBreadcrumb` — all in `frontend/src/components/category/`, ready for the future Homepage and category-listing phases to consume directly.

## Testing
See Testing Steps in the Phase 17 implementation notes.