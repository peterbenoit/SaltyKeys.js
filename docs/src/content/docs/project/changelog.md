---
title: Changelog
description: A history of all notable changes to SaltyKeys.js.
---

# Changelog

All notable changes to SaltyKeys.js are documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions and uses [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

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

[Unreleased]: https://github.com/peterbenoit/SaltyKeys.js/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/peterbenoit/SaltyKeys.js/releases/tag/v1.0.0
