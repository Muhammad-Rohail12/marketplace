// Single switch point per the roadmap's explicit "UI -> Service ->
// Mock now -> Real API later" requirement. Reads from an env var so
// it can be flipped per-environment without a code change; defaults
// to real API (false) so nothing in Phases 17-30 changes behavior
// unless a later UI-only phase explicitly opts in.
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';