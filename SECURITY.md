# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | ✅        |

## Scope

SaltyKeys.js is an **educational tool** for client-side API key obfuscation. The library explicitly documents that client-side JavaScript is inherently inspectable by end users. "Client-side code can be viewed in browser developer tools" is by design, not a vulnerability.

Legitimate security reports would cover unexpected behavior such as:
- The decode logic failing to reject a mismatched pen ID
- A crash or unhandled exception in `generateSaltedKey` or `getApiKey`
- A vulnerability in the documentation site (XSS, injection, etc.)

## Reporting a Vulnerability

Do **not** open a public GitHub issue for security vulnerabilities.

Please report them via [GitHub's private vulnerability reporting](https://github.com/peterbenoit/SaltyKeys.js/security/advisories/new).

You'll receive a response within 48 hours and a patch within 7 days for confirmed issues.
