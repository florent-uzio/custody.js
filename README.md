# Custody.js

A comprehensive JavaScript SDK for interacting with the Ripple Custody API. This SDK provides a clean, type-safe interface for managing domains, intents, accounts, transactions, and cryptographic operations.

## Features

- 🔐 **Cryptographic Support**: Ed25519 and secp256k1 keypair generation and signing
- 🏢 **Domain Management**: List and retrieve domain information
- 📋 **Intent Operations**: Propose, approve, reject, and manage intents
- 💰 **Account Management**: Manage accounts, addresses, and balances
- 🔄 **Transaction Operations**: Handle transaction orders, transfers, and dry runs
- 🛡️ **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🔄 **Async/Await**: Modern async/await patterns for all operations

## Installation

### From npm (recommended)

```bash
npm install custody.js
```

### From GitHub (acacia branch)

If you need to install directly from the GitHub repository (e.g., for testing or using the latest development version), you can install from the `acacia` branch.

**Authentication Required**: To install from GitHub, you need to generate a GitHub token with read access:

- **Fine-grained token**: Select the Custody.js project and then the `Metadata` permission with `read-only` access.
- **Classic token**: Use the `repo` scope (Full control of private repositories) - this includes the read access needed for npm install

You can then use the token in your npm command:

```bash
npm install git+https://YOUR_TOKEN@github.com/florent-uzio/custody.js.git#acacia
```

**Note**: The `acacia` branch is automatically synchronized with the `main` branch and includes the built `dist` directory, making it suitable for direct GitHub installation.

## Quick Start

### 1. Generate Keypairs

First, you'll need to generate cryptographic keypairs for authentication and signing:

```typescript
import { KeypairService } from "custody.js"

// Generate Ed25519 keypair
const ed25519Service = new KeypairService("ed25519")
const ed25519Keypair = ed25519Service.generate()

console.log("Ed25519 Private Key:", ed25519Keypair.privateKey)
console.log("Ed25519 Public Key:", ed25519Keypair.publicKey)

// Generate secp256k1 keypair
const secp256k1Service = new KeypairService("secp256k1")
const secp256k1Keypair = secp256k1Service.generate()

console.log("secp256k1 Private Key:", secp256k1Keypair.privateKey)
console.log("secp256k1 Public Key:", secp256k1Keypair.publicKey)

// Generate secp256r1 keypair
const secp256r1Service = new KeypairService("secp256r1")
const secp256r1Keypair = secp256r1Service.generate()

console.log("secp256r1 Private Key:", secp256r1Keypair.privateKey)
console.log("secp256r1 Public Key:", secp256r1Keypair.publicKey)
```

Use those keypairs in Ripple Custody when setting up your API user.  
Use a `.env` file to store your public and private key.

**Note**: The SDK supports Ed25519, secp256k1, and secp256r1 algorithms.

### 2. Initialize the RippleCustody Client

```typescript
import { RippleCustody } from "custody.js"

const custody = new RippleCustody({
  baseUrl: "https://api.ripple.com",
  privateKey: ed25519Keypair.privateKey, // Your private key in PEM format
  publicKey: ed25519Keypair.publicKey, // Your public key in base64 format
})
```

### 3. Use the SDK

The SDK provides a namespaced API for easy discovery and usage:

```javascript
// 🏢 Domain Operations
const domains = await custody.domains.list()
const domain = await custody.domains.get({ domainId: "your-domain-id" })

// 📋 Intent Operations
const intent = await custody.intents.propose({
  request: {
    author: { id: "user-id", domainId: "domain-id" },
    type: "Propose",
    // ... other intent parameters
  },
  signature: "", // optional - signature will be automatically added by the SDK if not provided in the json body
})

await custody.intents.approve({
  request: {
    author: { id: "user-id", domainId: "domain-id" },
    type: "Approve",
    // ... approval parameters
  },
  signature: "", // optional - Will be auto-generated if not provided
})

// 💰 Account Operations
const accounts = await custody.accounts.list({ domainId: "domain-id" }, { limit: 10 })

const account = await custody.accounts.get({ domainId: "domain-id", accountId: "account-id" })

const addresses = await custody.accounts.addresses({ domainId: "domain-id" })

const newAddress = await custody.accounts.generateNewExternalAddress({
  domainId: "domain-id",
  accountId: "account-id",
  ledgerId: "ledger-id",
})

const balances = await custody.accounts.getAccountBalances({
  domainId: "domain-id",
  accountId: "account-id",
})

// 🔄 Transaction Operations
const transactionOrders = await custody.transactions.orders(
  { domainId: "domain-id" },
  { limit: 10 },
)

const order = await custody.transactions.order({
  domainId: "domain-id",
  transactionOrderId: "order-id",
})

const transfers = await custody.transactions.transfers({ domainId: "domain-id" }, { limit: 10 })

const dryRunResult = await custody.transactions.dryRun(
  { domainId: "domain-id" },
  {
    // Transaction parameters
  },
)
```

## Error Handling

The SDK provides typed error handling through the `CustodyError` class. All API errors are thrown as `CustodyError` instances with the following structure:

```typescript
import { CustodyError } from "custody.js"

try {
  const domains = await custody.domains.list()
} catch (error) {
  if (error instanceof CustodyError) {
    console.log("Error reason:", error.reason) // The main error reason
    console.log("Error message:", error.errorMessage) // Additional error details
    console.log("Status code:", error.statusCode) // HTTP status code
    console.log("Full error:", error.toJSON()) // Complete error object
  }
}
```

The `CustodyError` class extends the standard `Error` class and provides typed access to the API's error response structure.

## Development

### Branch Strategy

This repository uses two main branches:

- **`main`**: The primary development branch containing source code and tests
- **`acacia`**: A deployment branch that includes the built `dist` directory for GitHub installation

### Automated Sync

The `acacia` branch is automatically synchronized with `main` via GitHub Actions. Every time changes are merged into `main`, the workflow:

1. Builds the project using `npm run build`
2. Updates the `acacia` branch with the latest changes
3. Resolves merge conflicts in `.gitignore` to ensure the `dist` directory is included
4. Pushes the updated `acacia` branch

This ensures that users installing from GitHub always get the latest built version.

## License

MIT License - see [LICENSE](./LICENSE) file for details.
