---
title: Changelog
description: A history of all notable changes to SaltyKeys.js.
---

# Changelog

All notable changes to SaltyKeys.js are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions and uses [Semantic Versioning](https://semver.org/).

---

## [1.2.0] — March 7, 2026

### Added
- **Test suite** (`test/SaltyKeys.test.js`) — 30 tests using Node.js built-in `node:test`, zero extra dependencies
- `"test"` script in `package.json` (`node --test test/SaltyKeys.test.js`)
- `"type": "module"` in `package.json` for native ESM support
- In-page warning banner (`_showWarning()`) displayed when `getPenId()` cannot resolve a pen ID — covers both "pen not yet saved" and "not on CodePen" scenarios
- Deduplication of warning banners via `#warnShown` private Set

### Fixed
- `getApiKey()` now correctly recovers API keys that contain `:` characters — previously the colon-split destructure would treat the second segment of the key as the pen ID; now the last three segments (nonce, timestamp, penId) are popped and the remainder is rejoined
- `urlPattern` and hostname check extended to cover `cdpn.io` (CodePen's embed/short-link domain) alongside `codepen.io`

---

## [1.1.0] — March 2026

### Added
- Astro + Starlight documentation site in `docs/`
- CodePenButton component for live demos in documentation
- Vercel deployment configuration (`vercel.json`)
- Standard repository files: `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`

---

## [1.0.0] — May 2025

### Added
- Initial release of `SaltyKeys.js`
- `configure()` — shallow-merge configuration updates for `urlPattern`, `cacheEnabled`, and `environment`
- `getPenId()` — extracts the CodePen pen ID from `window.location.href` or a canonical `<link>` tag, with optional caching
- `generateSaltedKey(apiKey)` — produces an obfuscated key using the pen ID, a timestamp, and a random nonce encoded in reversed Unicode-safe Base64
- `getApiKey(saltedKey)` — decodes a salted key and returns the original API key if the pen ID matches the current context
- `_safeEncode` / `_safeDecode` — Unicode-safe Base64 helpers built on `encodeURIComponent` + `btoa`/`atob`
- Default URL pattern covers CodePen editor view, debug view, full-page view, and full embed grid view
- Private class field `#cachedPenId` for caching the extracted pen ID

[1.2.0]: https://github.com/peterbenoit/SaltyKeys.js/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/peterbenoit/SaltyKeys.js/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/peterbenoit/SaltyKeys.js/releases/tag/v1.0.0
