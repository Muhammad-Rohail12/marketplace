NOTE FOR THIS PHASE'S INTEGRATION:

`backend/src/product/services/product.service.js` (Phase 22) does not
currently `include: { media: true }` in its `PUBLIC_SELECT`,
`listMyProducts`, or `listAllProducts` queries — that file was
provided in full in Phase 22 and per the "never invent existing file
contents" rule, it is not blindly rewritten here.

To wire media into product listings, add `media: { where: { status:
'ACTIVE' }, orderBy: { sortOrder: 'asc' } }` to:
- `PUBLIC_SELECT` in product.service.js (as a Prisma `select`, matching
  the existing pattern)
- the `include` blocks in `listMyProducts` and `listAllProducts`

This one-line addition per query is a MODIFY to an existing Phase 22
file. Since I do not have your current on-disk copy of that exact
file to safely diff against (it may have been hand-edited since
Phase 22), please paste its current contents and I will provide the
exact modified version in a follow-up — this avoids overwriting any
changes you've made.