# SaltyKeys.js

A JavaScript library for obfuscating and verifying API keys on the client side while using CodePen. **SaltyKeys** provides methods to extract a CodePen Pen ID, generate a salted API key, and retrieve the original API key if the context is valid.

## Disclaimer

**Warning**: This library is intended for educational purposes only and is **not secure** for use in a production environment. The methods provided rely on client-side obfuscation techniques, which are inherently insecure and can be easily reversed by unskilled attackers. Sensitive information, such as API keys, should always be stored and managed on the server side, never exposed to client-side scripts.

**Use at your own risk.** The authors assume no responsibility or liability for any use of this library in a production environment or for any consequences that arise from its use.

## Usage

### 1. Configuration (Optional)

SaltyKeys can be configured to work in different environments:

```js
SaltyKeys.configure({
    urlPattern: /your-site\.com\/project\/([^?#]+)/, // Custom URL pattern
    cacheEnabled: true, // Enable/disable ID caching
    environment: 'custom', // Environment identifier
});
```

### 2. Generate a Salted Key

To generate a salted key using your original API key:

```js
const apiKey = 'my-original-api-key'; // Your real API key
const saltedKey = SaltyKeys.generateSaltedKey(apiKey);
console.log('Generated Salted Key:', saltedKey);
```

It would be best to run this in the console, and not on the page you want to hide your key on.

### 3. Retrieve the Actual API Key

To retrieve the original API key from the salted key:

```js
const actualApiKey = SaltyKeys.getApiKey(saltedKey);

if (actualApiKey) {
    console.log('API Key is valid:', actualApiKey);
    // Use the API key in your logic
} else {
    console.warn('Failed to retrieve the API key.');
}
```

## Deployment Guide

### Prerequisites

-   Basic JavaScript knowledge
-   A text editor
-   Web browser supporting ES6 features (ES2022+ for private fields)
-   A web server or hosting platform for deployment

### Installation Instructions

#### CodePen (Original Design Context)

1. Create a new pen on [CodePen](https://codepen.io/)
2. Copy the contents of `SaltyKeys.js` into a JavaScript file in your pen
3. Reference the script in your pen's HTML

#### Other Platforms

##### Direct Script Include

```html
<script src="path/to/SaltyKeys.js"></script>
```

##### As ES6 Module (requires modification)

```js
// SaltyKeys.js (modified)
export default class SaltyKeys {
    // Existing code...
}

// Usage
import SaltyKeys from './path/to/SaltyKeys.js';
```

##### NPM Package (requires additional setup)

1. Create a package.json file
2. Set up the module entry point
3. Publish to npm or use locally
4. Install with: `npm install your-package-name`

### Environment Setup Requirements

#### CodePen-Specific Environment

-   The library explicitly relies on CodePen's URL structure by default
-   Requires a valid CodePen Pen ID to function
-   Works in both the CodePen editor and embedded views

#### Non-CodePen Environments

To use outside of CodePen, configure the library as follows:

```js
SaltyKeys.configure({
    urlPattern: /your-site\.com\/projects\/([^?#]+)/, // Your URL pattern with a capture group
    environment: 'custom',
});
```

You can also completely override the Pen ID extraction:

```js
// Example custom implementation
SaltyKeys.getPenId = function () {
    // Your custom implementation
    return window.location.pathname.split('/').pop();
};
```

## Technical Specifications

### Dependencies and External Resources

-   **None**: The library is self-contained and uses only native browser APIs
-   Uses the following browser features:
    -   `window.location`
    -   `document.querySelector()`
    -   `btoa()` and `atob()` for Base64 encoding/decoding
    -   ES6+ features including private class fields
    -   Regular expressions for URL parsing

### Browser Compatibility

-   Requires a browser with support for:
    -   ES6+ features (modern browsers from 2015+)
    -   ES2022 features for private class fields (#)
    -   Base64 encoding/decoding via `btoa()`/`atob()`
    -   Modern DOM methods
    -   Regular expressions

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 92+             |
| Firefox | 90+             |
| Safari  | 15+             |
| Edge    | 92+             |
| IE      | Not supported   |

### Known Limitations and Constraints

1. **CodePen Dependency**: Default configuration is designed for CodePen URL structure
2. **Client-side Only**: No server-side protection mechanisms
3. **Advanced Obfuscation**: Uses multi-layered encoding and randomization, but not true encryption
4. **Context Sensitive**: Only works in the originating environment by design
5. **Potentially Reversible**: Determined attackers could still decode with effort

### Security Considerations

-   **NOT SECURE**: This is an educational tool, not a security solution
-   **Obfuscation ≠ Security**: The encoding can still be reversed with effort
-   **Enhanced Mechanisms**: Uses timestamp, nonce, and multi-layered encoding for better obfuscation
-   **Unicode Support**: Safely handles Unicode characters in keys
-   **Proper API Key Management**:
    -   Use environment variables on the server
    -   Implement proper authentication and authorization
    -   Create API proxies to keep keys server-side
    -   Use API key rotation and monitoring
    -   Consider implementing CORS policies correctly

### Performance Recommendations

-   **Minimal Impact**: The library has negligible performance impact
-   **Built-in Caching**: The library now caches the Pen ID by default (can be disabled)
-   **Error Handling**: Comprehensive error handling is implemented

### API Reference

#### Configuration

```js
SaltyKeys.configure(options);
```

-   `options`: Object with configuration properties:
    -   `urlPattern`: RegExp for extracting IDs from URLs
    -   `cacheEnabled`: Boolean to enable/disable caching
    -   `environment`: String identifier for the environment

#### Core Methods

```js
SaltyKeys.getPenId();
```

Returns the ID extracted from the current URL or canonical link.

```js
SaltyKeys.generateSaltedKey(apiKey);
```

Generates a salted key from your original API key.

```js
SaltyKeys.getApiKey(saltedKey);
```

Retrieves the original API key from a salted key.

#### Utility Methods

```js
SaltyKeys._safeEncode(string);
```

Encodes a string with Unicode support.

```js
SaltyKeys._safeDecode(string);
```

Decodes a string with Unicode support.

### Testing Requirements

For testing SaltyKeys modifications:

1. **Unit Testing**:

    - Test the `getPenId()` function with various URL formats
    - Validate key generation with different inputs including Unicode characters
    - Verify key retrieval in valid and invalid contexts
    - Test configuration options

2. **Integration Testing**:

    - Test in embedded iframes
    - Verify behavior when canonical links are present/absent
    - Test across different browsers

3. **Mock Environment**:
    - Create test fixtures simulating CodePen's URL structure
    - Mock document and window objects for controlled testing

### Troubleshooting Guide

| Issue                      | Possible Cause               | Solution                                                       |
| -------------------------- | ---------------------------- | -------------------------------------------------------------- |
| `Unable to extract Pen ID` | Not in a CodePen environment | Configure the library for your environment                     |
| Key validation fails       | Different Pen ID at runtime  | Generate and retrieve keys in the same context                 |
| `atob is not defined`      | Older browser                | Library includes safe encoding/decoding methods                |
| Encoding/decoding errors   | Unicode character issues     | The library now handles Unicode characters properly            |
| Empty key returned         | Invalid salted key format    | Ensure the key was properly generated with the current version |
| Uncaught errors            | DOM elements missing         | All DOM operations now use try-catch blocks                    |

## Recommended Deployment Architecture

For production applications requiring API key security:

1. **Client-side**: Use SaltyKeys for educational purposes only
2. **Server-side Alternative**:
    - Create a backend API proxy service
    - Store API keys securely on the server
    - Return only necessary data to the client
    - Implement proper authentication

```
┌─────────────┐      ┌─────────────┐      ┌───────────────┐
│             │      │             │      │               │
│  Client     │──────│  API Proxy  │──────│  External API │
│  Browser    │      │  Server     │      │  Service      │
│             │      │             │      │               │
└─────────────┘      └─────────────┘      └───────────────┘
     No keys           Secure key
                      management
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Note:** This library is not intended for use in secure applications. Use proper server-side security measures to protect sensitive data.
