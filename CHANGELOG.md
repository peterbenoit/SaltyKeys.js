# Changelog

All notable changes to SaltyKeys.js are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [1.2.0] - March 7, 2026

### Added
- **Test suite** (`test/SaltyKeys.test.js`) — 30 tests using Node.js built-in `node:test`, zero extra dependencies
- `"test"` script in `package.json` (`node --test test/SaltyKeys.test.js`)
- `"type": "module"` in `package.json` for native ESM support
- In-page warning banner (`_showWarning()`) displayed when `getPenId()` cannot resolve a pen ID — covers both "pen not yet saved" and "not on CodePen" scenarios
- Deduplication of warning banners via `#warnShown` private Set

### Fixed
- `getApiKey()` now correctly recovers API keys that contain `:` characters — previously the colon-split destructure would treat the second segment of the key as the pen ID; now the last three segments (nonce, timestamp, penId) are popped from the array and the remainder is rejoined as the original key
- `urlPattern` and hostname check extended to cover `cdpn.io` (CodePen's embed/short-link domain) in addition to `codepen.io`

## [1.1.0] - March 2026

### Added
- Astro + Starlight documentation site in `docs/`
- Vercel deployment configuration (`vercel.json`)
- Standard repository files: `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`

## [1.0.0] — May 2025

### Added
- Initial release of `SaltyKeys.js`
- `configure()`, `getPenId()`, `generateSaltedKey()`, `getApiKey()` static methods
- Unicode-safe Base64 helpers (`_safeEncode`, `_safeDecode`)
- Pen ID caching via private class field
- Default CodePen URL pattern covering pen, debug, fullpage, and fullembedgrid views

[1.2.0]: https://github.com/peterbenoit/SaltyKeys.js/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/peterbenoit/SaltyKeys.js/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/peterbenoit/SaltyKeys.js/releases/tag/v1.0.0
