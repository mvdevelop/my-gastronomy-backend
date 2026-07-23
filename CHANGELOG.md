# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-07-22

### Added
- **TypeScript types** — Full domain model interfaces (`IUser`, `IPlate`, `IOrder`, DTOs, `SafeUser`)
- **Input validation** — Declarative validation middleware for all routes (auth, plates, orders)
- **JWT authentication middleware** — Bearer token verification on protected routes
- **Global error handler** — Catches unhandled errors, invalid JSON, and malformed ObjectIds
- **Request logger** — Structured logging of method, URL, status, and duration
- **Rate limiting** — Configurable per-minute request limit via `express-rate-limit`
- **Security headers** — `helmet` middleware for HTTP security best practices
- **Health check endpoint** — `GET /api/v1/health` with MongoDB ping and uptime
- **API versioning** — All routes now under `/api/v1/` prefix
- **Graceful shutdown** — SIGTERM handler for clean server disconnect
- **Structured logging** — `pino` with `pino-pretty` in development, JSON in production
- **Tests** — 34 tests across helpers, middleware, and data access layers using Vitest + MongoDB Memory Server
- **ESLint + Prettier** — Automated code quality enforcement
- **GitHub Actions CI** — Type check, lint, format check, test, and build pipeline
- **Multi-stage Dockerfile** — Smaller production image with `npm ci`, non-root user
- **Coverage reporting** — `npm run test:coverage` with V8 provider

### Fixed
- **Critical: Infinite recursion** in `Mongo.db` getter/setter (renamed backing field to `_db`)
- **Critical: JWT secret hardcoded** as `'secret'` — now reads from `process.env.JWT_SECRET`
- **Critical: Password/salt leaked in JWT** — now signs only `SafeUser` fields
- **Critical: NoSQL injection risk** — all inputs now validated before reaching MongoDB
- **Bug: `updateUser` returned `undefined`** when password provided — converted callback to async/await
- **Bug: Signup hung** when `insertedId` was falsy — added explicit error response
- **Bug: Unhandled promise rejections** crashed the process — added try-catch in all route handlers
- **Bug: Error objects leaked to clients** — `serverError` now logs internally only
- **Bug: Duplicate entry points** (`index.ts` / `main.ts`) — consolidated to single `index.ts`
- **Bug: Unused `crypto` import** in `dataAccess/plates.ts` removed
- **Bug: Controller `dataAccess` not declared** as class property — added `private` declarations
- **Bug: `HttpResponse` not exported** — added `export` for type reuse

### Changed
- Routes use proper HTTP status codes (`409` for duplicate user, `401` for bad credentials)
- `updatePlates` → `updatePlate`, `getPlate` → `getAllPlates` (consistent naming)
- Orders aggregation pipeline deduplicated into shared `aggregateOrders()` method
- All `any` types replaced with proper TypeScript interfaces and DTOs
- All `console.log`/`console.error` replaced with structured `pino` logger
- Port read from `process.env.PORT` instead of hardcoded `3000`
- `.env.example` cleaned to only include variables the app actually uses
- `package.json` scripts fixed: `build` runs `tsc`, `start` runs `node dist/index.js`

### Removed
- Duplicate entry point `src/main.ts`
- Bloated `.env.example` (removed unused AWS, OAuth, Redis, email, session configs)
- Unused imports (`crypto` in plates.ts)
- Stale Portuguese comments

## [1.0.0] - 2024-01-01

### Added
- Initial release with Express + TypeScript + MongoDB
- Basic CRUD for users, plates, and orders
- JWT authentication with Passport.js
- PBKDF2 password hashing
- Dockerfile and Vercel deployment config
