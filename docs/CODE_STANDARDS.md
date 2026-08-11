# Code Standards

## Folder Naming
- All lowercase, kebab-case for multi-word folders (`user-profile/`, not `UserProfile/`)

## File Naming
- Backend: `camelCase.type.js` — e.g. `health.controller.js`, `health.service.js`, `health.routes.js`
- Frontend components: `PascalCase.jsx` — e.g. `Button.jsx`, `Navbar.jsx`
- Frontend hooks/utils/config: `camelCase.js` — e.g. `useApi.js`, `formatDate.js`, `api.config.js`

## Component Naming
- React components use `PascalCase` and are exported as default exports
- One component per file, matching the filename

## Function & Variable Naming
- `camelCase` for all JS functions and variables
- Boolean variables prefixed with `is`/`has`/`should` (e.g. `isLoading`, `hasError`)

## Import Ordering
1. External packages (`react`, `express`, `next/link`)
2. Internal aliases (`@/components/...`, `@/utils/...`)
3. Relative imports (`./file`, `../file`)

## Error Handling
- Backend: throw `AppError` for expected/operational errors; let unexpected errors bubble to the centralized error handler
- Frontend: catch `ApiError` from `apiClient`; never let a raw fetch rejection reach the UI unhandled

## Configuration
- Backend: never access `process.env` directly outside `src/config/`
- Frontend: never access `process.env` directly outside `src/config/`

## Commit Message Format
Conventional Commits style: