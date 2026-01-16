# Custody.js

A comprehensive JavaScript SDK for interacting with the Ripple Custody API. This SDK provides a clean, type-safe interface for managing domains, intents, accounts, transactions, and cryptographic operations.

⚠️ **Do not use this SDK in production.** This is personal code that may contain bugs and is not regularly maintained.

## Features

- 🔐 **Cryptographic Support**: Ed25519, secp256k1, secp256r1 keypair generation and signing
- 🏢 **Domain Management**: List and retrieve domain information
- 📋 **Intent Operations**: Propose, approve, reject, and manage intents
- 💰 **Account Management**: Manage accounts, addresses, and balances
- 🔄 **Transaction Operations**: Handle transaction orders, transfers, and dry runs
- 🛡️ **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🔄 **Async/Await**: Modern async/await patterns for all operations

## Installation

### From GitHub

This repo is not published on NPM.

Install directly from the GitHub repository:

```bash
npm install github:florent-uzio/custody.js
```

## Quick Start

### 1. Generate Keypairs

First, you'll need to generate cryptographic keypairs for authentication and signing:

```typescript
import { KeypairService } from "custody"

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
import { RippleCustody } from "custody"

const custody = new RippleCustody({
  apiUrl: "https://api.ripple.com",
  authUrl: "https://auth.api.ripple.com",
  privateKey: ed25519Keypair.privateKey, // Your private key in PEM format
  publicKey: ed25519Keypair.publicKey, // Your public key in base64 format
})
```

### 3. Use the SDK

The SDK provides a namespaced API for easy discovery and usage:

```javascript
// 🏢 Domain Operations
const domains = await custody.domains.list({ domainId: "your-domain-id" })

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

The SDK throws `CustodyError` instances for all API errors:

```typescript
import { CustodyError } from "custody"

try {
  const domains = await custody.domains.list()
} catch (error) {
  if (error instanceof CustodyError) {
    console.log(error.message)      // Main error reason
    console.log(error.statusCode)   // HTTP status code (e.g., 400, 404)
    console.log(error.errorMessage) // Optional additional details from API
    console.log(error.cause)        // Original error for debugging
    console.log(error.toJSON())     // Structured object for logging/serialization
  }
}
```

`console.log(error)` outputs a clean, readable format. Access `error.cause` for full debugging details.

## License

MIT License - see [LICENSE](./LICENSE) file for details.
