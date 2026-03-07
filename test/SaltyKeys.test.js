import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ---------------------------------------------------------------------------
// Browser global polyfills
// These stubs provide just enough surface area for SaltyKeys.js to run.
// ---------------------------------------------------------------------------

function makeLocation(href) {
	const url = new URL(href);
	return { href, hostname: url.hostname };
}

function makeDocument(canonicalHref = null) {
	// Minimal DOM stub used by getPenId() and _showWarning()
	const el = {
		style: { cssText: '', flex: '' },
		textContent: '',
		onclick: null,
		setAttribute() { },
		appendChild() { },
		prepend() { },
		remove() { },
	};
	return {
		querySelector(selector) {
			if (selector === 'link[rel="canonical"]' && canonicalHref) {
				return { getAttribute: () => canonicalHref };
			}
			return null;
		},
		createElement() { return { ...el }; },
		createTextNode() { return {}; },
		body: { prepend() { } },
		readyState: 'complete',
		addEventListener() { },
	};
}

// Load library source once; instances are created fresh per test.
const libPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'SaltyKeys.js');
const libSrc = readFileSync(libPath, 'utf8');

// Base64 polyfills — Buffer behaviour is byte-identical to the browser APIs.
globalThis.btoa = (s) => Buffer.from(s, 'binary').toString('base64');
globalThis.atob = (s) => Buffer.from(s, 'base64').toString('binary');

// Module-level reference updated by freshSaltyKeys() before every test.
// eslint-disable-next-line prefer-const
let SaltyKeys;

// ---------------------------------------------------------------------------
// Helper: reset SaltyKeys state between tests.
// Private fields (#cachedPenId, #warnShown) cannot be reset from outside the
// class, so we use new Function() to get a brand-new class each time.
// new Function() runs outside strict mode, honouring the class declaration
// and allowing us to return the class from the function body.
// ---------------------------------------------------------------------------
function freshSaltyKeys(href, canonicalHref = null) {
	globalThis.window = { location: makeLocation(href) };
	globalThis.document = makeDocument(canonicalHref);
	// Returns a fresh class with all private static fields reset to defaults.
	SaltyKeys = new Function(`${libSrc}\nreturn SaltyKeys;`)(); // eslint-disable-line no-new-func
}

// ---------------------------------------------------------------------------
// getPenId()
// ---------------------------------------------------------------------------
describe('getPenId()', () => {
	test('extracts ID from a codepen.io pen URL', () => {
		freshSaltyKeys('https://codepen.io/username/pen/AbCdEf');
		assert.equal(SaltyKeys.getPenId(), 'AbCdEf');
	});

	test('extracts ID from a cdpn.io pen URL', () => {
		freshSaltyKeys('https://cdpn.io/username/pen/XyZ123');
		assert.equal(SaltyKeys.getPenId(), 'XyZ123');
	});

	test('extracts ID from a debug view URL', () => {
		freshSaltyKeys('https://codepen.io/username/debug/DebugId');
		assert.equal(SaltyKeys.getPenId(), 'DebugId');
	});

	test('extracts ID from a fullpage view URL', () => {
		freshSaltyKeys('https://codepen.io/username/fullpage/FullId');
		assert.equal(SaltyKeys.getPenId(), 'FullId');
	});

	test('falls back to canonical link when URL does not match', () => {
		freshSaltyKeys(
			'https://example.com/embed',
			'https://codepen.io/username/pen/CanonId'
		);
		assert.equal(SaltyKeys.getPenId(), 'CanonId');
	});

	test('returns undefined when URL and canonical both do not match', () => {
		freshSaltyKeys('https://example.com/no-match');
		assert.equal(SaltyKeys.getPenId(), undefined);
	});

	test('caches the pen ID on subsequent calls', () => {
		freshSaltyKeys('https://codepen.io/username/pen/CacheId');
		const first = SaltyKeys.getPenId();
		// Swap out the URL — cached value should still be returned
		globalThis.window.location.href = 'https://codepen.io/username/pen/OtherId';
		const second = SaltyKeys.getPenId();
		assert.equal(first, 'CacheId');
		assert.equal(second, 'CacheId'); // from cache
	});

	test('re-queries when cacheEnabled is false', () => {
		freshSaltyKeys('https://codepen.io/username/pen/FirstId');
		SaltyKeys.configure({ cacheEnabled: false });
		SaltyKeys.getPenId(); // prime
		globalThis.window = { location: makeLocation('https://codepen.io/username/pen/SecondId') };
		assert.equal(SaltyKeys.getPenId(), 'SecondId');
	});

	test('works with a custom urlPattern', () => {
		freshSaltyKeys('https://example.com/projects/my-project-id');
		SaltyKeys.configure({
			urlPattern: /example\.com\/projects\/([^?#]+)/,
			environment: 'custom',
		});
		assert.equal(SaltyKeys.getPenId(), 'my-project-id');
	});
});

// ---------------------------------------------------------------------------
// generateSaltedKey()
// ---------------------------------------------------------------------------
describe('generateSaltedKey()', () => {
	beforeEach(() => {
		freshSaltyKeys('https://codepen.io/username/pen/TestPen');
	});

	test('returns a non-empty string for a valid API key', () => {
		const result = SaltyKeys.generateSaltedKey('my-api-key');
		assert.equal(typeof result, 'string');
		assert.ok(result.length > 0);
	});

	test('returns a different string on each call (nonce + timestamp)', () => {
		const a = SaltyKeys.generateSaltedKey('my-api-key');
		// Re-eval to clear cache so getPenId() runs fresh without a new pen URL
		freshSaltyKeys('https://codepen.io/username/pen/TestPen');
		const b = SaltyKeys.generateSaltedKey('my-api-key');
		// Statistically impossible for timestamp+nonce to collide
		assert.notEqual(a, b);
	});

	test('returns null for an empty string', () => {
		assert.equal(SaltyKeys.generateSaltedKey(''), null);
	});

	test('returns null for a non-string', () => {
		assert.equal(SaltyKeys.generateSaltedKey(null), null);
		assert.equal(SaltyKeys.generateSaltedKey(42), null);
	});

	test('returns null when pen ID cannot be extracted', () => {
		freshSaltyKeys('https://example.com/no-id');
		assert.equal(SaltyKeys.generateSaltedKey('my-api-key'), null);
	});

	test('handles API keys containing colons', () => {
		// The key itself may contain colons; only the first colon-segment is the key
		const result = SaltyKeys.generateSaltedKey('prefix:suffix');
		assert.notEqual(result, null);
	});
});

// ---------------------------------------------------------------------------
// getApiKey()
// ---------------------------------------------------------------------------
describe('getApiKey()', () => {
	beforeEach(() => {
		freshSaltyKeys('https://codepen.io/username/pen/RoundTrip');
	});

	test('round-trips: getApiKey(generateSaltedKey(key)) === key', () => {
		const original = 'my-secret-api-key';
		const salted = SaltyKeys.generateSaltedKey(original);
		// Fresh class but same pen URL so pen ID still matches
		freshSaltyKeys('https://codepen.io/username/pen/RoundTrip');
		assert.equal(SaltyKeys.getApiKey(salted), original);
	});

	test('returns null when pen ID does not match the one in the salted key', () => {
		const salted = SaltyKeys.generateSaltedKey('my-key');
		// Switch to a different pen
		freshSaltyKeys('https://codepen.io/username/pen/DifferentPen');
		assert.equal(SaltyKeys.getApiKey(salted), null);
	});

	test('returns null for an empty string', () => {
		assert.equal(SaltyKeys.getApiKey(''), null);
	});

	test('returns null for a non-string', () => {
		assert.equal(SaltyKeys.getApiKey(null), null);
		assert.equal(SaltyKeys.getApiKey(undefined), null);
	});

	test('returns null for a corrupted/arbitrary string', () => {
		assert.equal(SaltyKeys.getApiKey('not-a-valid-salted-key'), null);
	});

	test('returns null when pen ID cannot be extracted', () => {
		const salted = SaltyKeys.generateSaltedKey('my-key');
		freshSaltyKeys('https://example.com/no-id');
		assert.equal(SaltyKeys.getApiKey(salted), null);
	});

	test('handles API keys that contain colons', () => {
		freshSaltyKeys('https://codepen.io/username/pen/ColonKey');
		const original = 'prefix:suffix';
		const salted = SaltyKeys.generateSaltedKey(original);
		freshSaltyKeys('https://codepen.io/username/pen/ColonKey');
		assert.equal(SaltyKeys.getApiKey(salted), original);
	});

	test('handles Unicode characters in the API key', () => {
		freshSaltyKeys('https://codepen.io/username/pen/UnicodeKey');
		const original = 'key-with-émojis-🔑';
		const salted = SaltyKeys.generateSaltedKey(original);
		freshSaltyKeys('https://codepen.io/username/pen/UnicodeKey');
		assert.equal(SaltyKeys.getApiKey(salted), original);
	});
});

// ---------------------------------------------------------------------------
// configure()
// ---------------------------------------------------------------------------
describe('configure()', () => {
	beforeEach(() => {
		freshSaltyKeys('https://codepen.io/username/pen/ConfigTest');
	});

	test('merges options shallowly — unspecified keys are preserved', () => {
		SaltyKeys.configure({ cacheEnabled: false });
		assert.equal(SaltyKeys.config.cacheEnabled, false);
		assert.equal(SaltyKeys.config.environment, 'codepen'); // unchanged
	});

	test('custom environment is reflected in config', () => {
		SaltyKeys.configure({ environment: 'custom' });
		assert.equal(SaltyKeys.config.environment, 'custom');
	});

	test('custom urlPattern is used by getPenId()', () => {
		freshSaltyKeys('https://mysite.com/app/my-project');
		SaltyKeys.configure({
			urlPattern: /mysite\.com\/app\/([^?#]+)/,
			environment: 'custom',
		});
		assert.equal(SaltyKeys.getPenId(), 'my-project');
	});
});

// ---------------------------------------------------------------------------
// _safeEncode / _safeDecode (internal helpers)
// ---------------------------------------------------------------------------
describe('_safeEncode() / _safeDecode()', () => {
	beforeEach(() => {
		freshSaltyKeys('https://codepen.io/username/pen/EncodeTest');
	});

	test('round-trips ASCII strings', () => {
		const original = 'hello:world:123:abc';
		assert.equal(SaltyKeys._safeDecode(SaltyKeys._safeEncode(original)), original);
	});

	test('round-trips Unicode strings', () => {
		const original = 'café:résumé:🔑';
		assert.equal(SaltyKeys._safeDecode(SaltyKeys._safeEncode(original)), original);
	});

	test('_safeEncode returns a non-empty string', () => {
		const result = SaltyKeys._safeEncode('test');
		assert.ok(result && result.length > 0);
	});

	test('_safeDecode returns null for invalid base64', () => {
		// Suppress the expected console.warn
		const warn = console.warn;
		console.warn = () => { };
		assert.equal(SaltyKeys._safeDecode('!!!not-base64!!!'), null);
		console.warn = warn;
	});
});
