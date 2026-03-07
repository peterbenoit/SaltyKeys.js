# Changelog

All notable changes to SaltyKeys.js are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/peterbenoit/SaltyKeys.js/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/peterbenoit/SaltyKeys.js/releases/tag/v1.0.0
