# SaltyKeys.js

A JavaScript library for obfuscating and verifying API keys on the client side. **SaltyKeys** provides methods to extract a CodePen Pen ID, generate a salted API key, and retrieve the original API key if the context is valid.

## Disclaimer

**Warning**: This library is intended for educational purposes only and is **not secure** for use in a production environment. The methods provided rely on client-side obfuscation techniques, which are inherently insecure and can be easily reversed by unskilled attackers. Sensitive information, such as API keys, should always be stored and managed on the server side, never exposed to client-side scripts.

**Use at your own risk.** The authors assume no responsibility or liability for any use of this library in a production environment or for any consequences that arise from its use.

## Usage

### 1. Generate a Salted Key

To generate a salted key using your original API key:

```js
const apiKey = 'my-original-api-key'; // Your real API key
const saltedKey = SaltyKeys.generateSaltedKey(apiKey);
console.log('Generated Salted Key:', saltedKey);
```

### 2. Retrieve the Actual API Key

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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Note:** This library is not intended for use in secure applications. Use proper server-side security measures to protect sensitive data.
