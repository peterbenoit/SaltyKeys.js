# SaltyKeys.js — Technical Overview

> **Version 1.2.0** · MIT License · [GitHub](https://github.com/peterbenoit/SaltyKeys.js) · [Docs](https://peterbenoit.github.io/SaltyKeys.js)

---

## What It Is

SaltyKeys.js is a lightweight, zero-dependency JavaScript library for obfuscating API keys in client-side environments — primarily CodePen. It ties an encoded API key to the specific pen (or page) it was generated for, so the encoded string is useless if copied and run elsewhere.

The library provides three core operations:

1. **Extract** a unique identifier from the current page URL (the "pen ID")
2. **Encode** an API key using that identifier as a salt, producing a non-portable obfuscated token
3. **Decode** the token at runtime, returning the original key only when the current page matches the one the token was generated on

The entire library is a single static class (`SaltyKeys`) with no build step, no npm install, and no external dependencies.

---

## Why It Exists

CodePen is a popular tool for sharing front-end demos and prototypes. A common workflow is building a demo that calls a third-party API (e.g., OpenAI, Google Maps, weather services). The problem: CodePen pens are public. If you embed your real API key in the JavaScript panel, anyone who views the pen can see and steal the key.

The correct long-term solution is a server-side API proxy. But setting one up is often overkill for a quick demo, a classroom exercise, or a proof-of-concept. SaltyKeys.js was built to fill that gap — it is **not** a replacement for proper key management, but it raises the floor enough that a key embedded in a public pen is no longer readable at a glance.

The idea: salt the API key with something unique to this exact pen (its CodePen Pen ID), encode the result, and store only the encoded token in code. At runtime, the library regenerates the salt from the current URL, decodes the token, and returns the key. If the encoded token is copy-pasted into a different pen, the ID won't match and decoding fails.

---

## Target Audience

| Audience | Use Case |
|---|---|
| **CodePen creators** | Protecting API keys in public pens well enough that casual viewers cannot steal them |
| **Educators & students** | Teaching obfuscation concepts, client-side security limitations, and why server-side key management matters |
| **Front-end prototypers** | Sharing demos that call real APIs without exposing raw keys in the source |
| **Developers exploring CodePen** | Anyone who wants a quick solution while acknowledging the inherent limitations of client-side security |

SaltyKeys.js is **not** intended for production applications, apps handling sensitive user data, or any context where a real security boundary is required.

---

## How It Works

### 1. Pen ID Extraction (`getPenId`)

CodePen URLs follow a predictable structure:

```
https://codepen.io/{username}/pen/{penId}
```

`getPenId()` applies a regular expression to `window.location.href`. If the pen is running inside an iframe embed (where `window.location.href` is the embedding page's URL), it falls back to querying `document.querySelector('link[rel="canonical"]')`, which CodePen injects and which always points to the canonical pen URL.

The extracted ID is cached in a private class field after the first call so subsequent lookups are free.

If no ID can be resolved and the environment is set to `'codepen'`, a visible in-page warning banner is rendered with actionable guidance (e.g., "Save the pen first before generating a key").

### 2. Key Generation (`generateSaltedKey`)

```
apiKey  +  penId  +  timestamp  +  nonce
         └──────────────────────────────┘
                  combined string
                       │
                  _safeEncode()   ← btoa() with Unicode safety
                       │
                  reverse string
                       │
                 obfuscated token   ← what you store in your code
```

- **Salt** (`penId`): makes the token environment-specific
- **Timestamp**: adds entropy so two calls with the same key produce different tokens
- **Nonce**: random 8-character string for additional uniqueness

The result is reversed as a cheap, extra layer of visual obfuscation (not cryptographic).

**This step should be run once in the browser console on the saved pen** — not in the pen's JavaScript source — so the raw key never appears in the source.

### 3. Key Retrieval (`getApiKey`)

At runtime, inside the pen's JavaScript:

```
obfuscated token
      │
 reverse string
      │
 _safeDecode()   ← atob() with Unicode safety
      │
 split on ':'    ← pop nonce, timestamp, penId from the end
      │
 compare extracted penId == getPenId()
      │
 match → return apiKey
 no match → return null (+ console warning)
```

Because the original API key may contain colons, `getApiKey()` pops exactly the last three segments (nonce, timestamp, penId) and rejoins everything before them as the key. This correctly handles keys like `Bearer abc:def:ghi`.

---

## API Reference

All methods are static. Import or include the script, then call `SaltyKeys.*` directly — no instantiation needed.

### `SaltyKeys.configure(options)`

Call this before any other method if you need non-default behavior.

| Option | Type | Default | Description |
|---|---|---|---|
| `urlPattern` | `RegExp` | CodePen URL regex | Pattern to extract the pen/page ID from the URL. Must include one capture group. |
| `cacheEnabled` | `boolean` | `true` | Whether to cache the extracted ID after the first call. |
| `environment` | `string` | `'codepen'` | Controls which warnings are shown when the ID cannot be resolved. Set to `'custom'` to suppress CodePen-specific warnings. |

```js
SaltyKeys.configure({
    urlPattern: /mysite\.com\/demos\/([^?#]+)/,
    environment: 'custom',
});
```

---

### `SaltyKeys.getPenId()`

Extracts the page/pen ID from the current URL or canonical link.

**Returns:** `string | null` — the ID, or `null` if it cannot be resolved.

```js
const id = SaltyKeys.getPenId();
// e.g. "abcXYZ" on https://codepen.io/username/pen/abcXYZ
```

---

### `SaltyKeys.generateSaltedKey(apiKey)`

Encodes your real API key as a context-bound, obfuscated token.

**Parameters:**
- `apiKey` (`string`) — your original API key

**Returns:** `string | null` — the obfuscated token to store in your pen's source, or `null` on failure.

**Important:** Run this once from the browser console on the saved pen. Do not put the raw key in source alongside this call.

```js
// Run this in the CodePen console, not in the pen source:
const saltedKey = SaltyKeys.generateSaltedKey('sk-my-real-api-key-abc123');
console.log(saltedKey);
// → some long encoded string you'll copy into your pen
```

---

### `SaltyKeys.getApiKey(saltedKey)`

Decodes and returns the original API key, but only if the current page ID matches the one embedded in the token.

**Parameters:**
- `saltedKey` (`string`) — the obfuscated token produced by `generateSaltedKey()`

**Returns:** `string | null` — the original API key if the context matches, or `null` otherwise.

```js
const saltedKey = 'XVlBzgbaiCMRAjWwhTHctcuAx...'; // generated earlier
const apiKey = SaltyKeys.getApiKey(saltedKey);

if (apiKey) {
    // Use the key
    fetch(`https://api.example.com/data?key=${apiKey}`);
} else {
    console.warn('Could not retrieve API key.');
}
```

---

### `SaltyKeys._safeEncode(str)` / `SaltyKeys._safeDecode(str)`

Internal Unicode-safe wrappers around `btoa()` / `atob()`. Exposed on the class (prefixed with `_`) but not part of the public API. Avoid calling these directly.

---

## Configuration for Non-CodePen Environments

SaltyKeys.js ships configured for CodePen but can be adapted to any environment where the current page has a unique, consistent identifier in its URL.

```js
// Example: a demo site at mysite.com/demos/{demoId}
SaltyKeys.configure({
    urlPattern: /mysite\.com\/demos\/([^?#]+)/,
    environment: 'custom',
});
```

You can also fully override `getPenId()` for environments where the ID isn't in the URL:

```js
SaltyKeys.getPenId = function () {
    // Pull the ID from a data attribute, a meta tag, etc.
    return document.querySelector('meta[name="demo-id"]')?.content ?? null;
};
```

---

## Workflow: Step by Step

1. **Create and save your pen** on CodePen. The pen must be saved — unsaved pens have no ID.
2. **Include the library** in your pen's JS panel (paste the source or link it via CDN).
3. **Open the console** on the CodePen editor page.
4. **Generate a salted key** by calling `SaltyKeys.generateSaltedKey('your-real-api-key')` in the console and copying the output.
5. **Store the salted key** as a variable in your pen's source code (not the raw key).
6. **Retrieve the key at runtime** with `SaltyKeys.getApiKey(saltedKey)` inside your pen's logic.

```js
// What lives in your pen's JS source (safe to be public):
const SALTED = 'XVlBzgbaiCMRAjWwhTHctcuAxFCzXmqN...';

const apiKey = SaltyKeys.getApiKey(SALTED);
if (apiKey) {
    // proceed with the API call
}
```

---

## Security Model and Limitations

| Property | Detail |
|---|---|
| **Protection level** | Low — obfuscation only, not encryption |
| **Attacker model** | Casual viewers who read source; not determined attackers |
| **Reversibility** | A determined attacker with basic JavaScript skills can reverse the encoding |
| **Server-side protection** | None — the key reaches the browser in decoded form when `getApiKey()` runs |
| **Production suitability** | Not suitable. Use a server-side API proxy for production |

The library deliberately uses reversible encoding (base64 + reversal) rather than symmetric encryption because:
- No secret key needs to be embedded (which would defeat the purpose)
- The goal is context-binding, not secrecy
- It keeps the library dependency-free

**The correct production architecture** for protecting API keys in client-side apps:

```
Browser  →  Your API Proxy (server)  →  Third-party API
              ↑ stores the real key
```

SaltyKeys.js is a pragmatic tool for demos and education — it's honest about what it does and doesn't do.

---

## Browser Compatibility

| Browser | Minimum Version |
|---|---|
| Chrome | 92+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 92+ |
| Internet Explorer | Not supported |

Requires ES2022+ (private class fields `#`), `btoa`/`atob`, and standard DOM APIs.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `Unable to extract Pen ID` | Pen is not saved, or not on CodePen | Save the pen first; or configure `urlPattern` for your environment |
| `getApiKey()` returns `null` | Token was generated on a different pen | Regenerate the salted key on the correct pen |
| API key with `:` characters not recovered | Using a token generated before v1.2.0 | Regenerate the token with the current version |
| Warning banner appears in embed | Pen viewed via embed iframe on a non-CodePen page | Expected — configure `environment: 'custom'` if you control the embed page |
| `atob is not defined` | Non-browser environment (e.g., Node.js during tests) | Library is browser-only by design; test shims handle this in the test suite |

---

## Project Structure

```
SaltyKeys.js/          ← repo root
├── SaltyKeys.js       ← the library (single file, no build step)
├── test/
│   └── SaltyKeys.test.js   ← 30 tests, Node.js built-in test runner
├── docs/              ← Astro + Starlight documentation site
│   └── src/content/docs/
│       ├── getting-started/
│       ├── concepts/
│       ├── api/
│       └── project/
├── package.json
├── vercel.json        ← deploys docs/ to peterbenoit.github.io/SaltyKeys.js
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
└── CODE_OF_CONDUCT.md
```

---

## Running Tests

Tests use Node.js's built-in `node:test` runner — no extra dependencies required.

```bash
npm test
# or directly:
node --test test/SaltyKeys.test.js
```

The suite covers 30 cases including: valid and invalid key generation, keys containing colons, ID mismatch rejection, Unicode keys, caching behavior, and non-CodePen environment configuration.

---

## License

MIT — see the [LICENSE](https://github.com/peterbenoit/SaltyKeys.js/blob/main/LICENSE) file.

---

*SaltyKeys.js — obfuscation for demos, not a substitute for security.*
