# Custody.js

A comprehensive JavaScript/Typescript SDK for interacting with the Ripple Custody API. This SDK provides a clean, type-safe interface for managing domains, intents, accounts, transactions, and cryptographic operations.

> **Do not use this SDK in production.** This is personal code that may contain bugs and is not regularly maintained. Fork it and update it as you wish.

## Features

- **Cryptographic Support**: Ed25519, secp256k1, secp256r1 keypair generation and signing
- **Domain Management**: List and retrieve domain information
- **Endpoint Management**: List and retrieve endpoints within a domain
- **Intent Operations**: Propose, approve, reject, and manage intents with built-in polling
- **Account Management**: Manage accounts, addresses, and balances
- **Transaction Operations**: Handle transaction orders, transfers, and dry runs
- **User & Invitation Management**: Manage users, roles, and invitations
- **Vault Operations**: Export and import prepared operations
- **Compliance**: Provider connections, screening rules, policies, and IVMS-101 travel-rule messaging (`client.compliance.*`)
- **Health Probes**: Liveness and readiness probes for the Custody instance (`client.health.*`, app versions ≥ 1.36.1)
- **Webhooks & Channels**: Register webhook channels and read delivered events (`client.channels.*`)
- **Gas Station Sponsorship**: Sponsor ledger fees for accounts and domains (`client.sponsors.*`)
- **Omnibus Accounting**: Omnibus accounts with nested tenant sub-ledgers, deposit wallets, and withdrawals (`client.omnibus.*`)
- **Virtual Ledgers**: Virtual ledger accounting with nested virtual accounts, operations, transfers, and balances (`client.virtualLedgers.*`)
- **System Signing**: Retrieve system-signing info (`client.systemSigning.*`)
- **Type Safety**: Full TypeScript support with types derived from the OpenAPI specification
- **Ledger ID Autocomplete**: `LedgerId`, `XrplLedgerId`, and `NonXrplLedgerId` exports give IDE autocomplete for the supported ledgers (e.g. `"ethereum"`, `"xrpl"`, `"solana"`, …) while still accepting any string — so newly added ledgers never break the SDK
- **XRPL Intent Proposal**: Single `proposeIntent()` method for all XRPL transaction types (Payment, TrustSet, DepositPreauth, Clawback, OfferCreate, AccountSet, TicketCreate, Batch, MPToken operations) using a type-safe discriminated union
- **Raw Signing**: Sign arbitrary XRPL transactions and Batch inner transactions via Custody

## Architecture

The SDK is built around a few key layers:

- **`TypedTransport`** — wraps the HTTP client with automatic URL template interpolation and path/query parameter splitting.
- **Namespace factories** (`createDomains`, `createAccounts`, etc.) — return plain objects that map method names to typed transport calls. Each factory is a thin, stateless function.
- **`RippleCustody`** — the public client class that assembles all namespaces in its constructor. Consumers interact exclusively through `client.domains.list()`, `client.accounts.get()`, etc.
- **`XrplService`** — builds XRPL transaction intents via a single `proposeIntent()` entry point, handles domain/account resolution through injected I/O ports (`XrplPorts`), and supports raw signing with manifest polling.

## Installation

### From npm

```bash
npm install @florent-uzio/custody
```

### From GitHub

Alternatively, install directly from the GitHub repository:

```bash
npm install github:florent-uzio/custody.js
```

## Quick Start

### 1. Generate Keypairs

First, you'll need to generate cryptographic keypairs for authentication and signing:

```typescript
import { KeypairService } from "@florent-uzio/custody"

// Generate Ed25519 keypair
const ed25519Service = new KeypairService("ed25519")
const ed25519Keypair = ed25519Service.generate()

console.log("Ed25519 Private Key:", ed25519Keypair.privateKey)
console.log("Ed25519 Public Key:", ed25519Keypair.publicKey)

// Generate secp256k1 keypair
const secp256k1Service = new KeypairService("secp256k1")
const secp256k1Keypair = secp256k1Service.generate()

// Generate secp256r1 keypair
const secp256r1Service = new KeypairService("secp256r1")
const secp256r1Keypair = secp256r1Service.generate()
```

Use those keypairs in Ripple Custody when setting up your API user.
Use a `.env` file to store your public and private key.

**Note**: The SDK supports Ed25519, secp256k1, and secp256r1 algorithms.

### 2. Initialize the RippleCustody Client

```typescript
import { RippleCustody } from "@florent-uzio/custody"

const custody = new RippleCustody({
  apiUrl: "https://api.ripple.com",
  authUrl: "https://auth.api.ripple.com/token",
  privateKey: ed25519Keypair.privateKey, // Your private key in PEM format
  publicKey: ed25519Keypair.publicKey, // Your public key in base64 format
})
```

### 3. Use the SDK

The SDK provides a namespaced API for easy discovery and usage:

```typescript
// Domain Operations
const domains = await custody.domains.list()
const domain = await custody.domains.get({ domainId: "your-domain-id" })

// Endpoint Operations
const endpoints = await custody.endpoints.list(
  { domainId: "domain-id" },
  { limit: 10, sortBy: "alias" },
)
const endpoint = await custody.endpoints.get({
  domainId: "domain-id",
  endpointId: "endpoint-id",
})

// Intent Operations
const intent = await custody.intents.propose({
  request: {
    author: { id: "user-id", domainId: "domain-id" },
    type: "Propose",
    // ... other intent parameters
  },
  // signature is optional — the SDK auto-signs if not provided
})

await custody.intents.approve({
  request: {
    author: { id: "user-id", domainId: "domain-id" },
    type: "Approve",
    // ... approval parameters
  },
})

// Poll an intent until it reaches a terminal status
const result = await custody.intents.getAndWait(
  { domainId: "domain-id", intentId: "intent-id" },
  {
    maxRetries: 20,
    intervalMs: 3000,
    onStatusCheck: (status, attempt) => console.log(`Attempt ${attempt}: ${status}`),
  },
)

if (result.isSuccess) {
  console.log("Intent executed successfully!")
}

// Account Operations
const accounts = await custody.accounts.list({ domainId: "domain-id" }, { limit: 10 })
const account = await custody.accounts.get({ domainId: "domain-id", accountId: "account-id" })
const balances = await custody.accounts.getAccountBalances({
  domainId: "domain-id",
  accountId: "account-id",
})
const newAddress = await custody.accounts.generateNewExternalAddress({
  domainId: "domain-id",
  accountId: "account-id",
  ledgerId: "ledger-id",
})

// Find an account by its blockchain address (searches across all domains).
// Returns the full address reference, or undefined if not found.
// Use the options bag to disambiguate when the same address exists on
// multiple ledgers or in multiple domains.
const ref = await custody.accounts.findByAddress("rAddress...")
const refOnLedger = await custody.accounts.findByAddress("rAddress...", {
  ledgerId: "xrpl",
})
const refInDomain = await custody.accounts.findByAddress("rAddress...", {
  domainId: "domain-id",
})
// `findByAddressOrThrow` throws a `CustodyError` instead of returning undefined.
const account = await custody.accounts.findByAddressOrThrow("rAddress...", {
  ledgerId: "xrpl",
})

// Transaction Operations
const orders = await custody.transactions.orders({ domainId: "domain-id" }, { limit: 10 })
const transfers = await custody.transactions.transfers({ domainId: "domain-id" })
const dryRun = await custody.transactions.dryRun({ domainId: "domain-id" }, {/* params */})

// User Operations
const me = await custody.users.me()
const users = await custody.users.list({ domainId: "domain-id" })

// Ledger Operations
const ledgers = await custody.ledgers.list()
const fees = await custody.ledgers.fees({ ledgerId: "ledger-id" })

// Vault Operations
const vaults = await custody.vaults.list()
const exported = await custody.vaults.exportPreparedOperations({ vaultId: "vault-id" })

// Request State
const states = await custody.requests.userStates()
```

## Namespace reference

Every namespace below is wired on the `RippleCustody` client. The Quick Start
above shows the most common ones; this table is the full surface. XRPL and Batch
signing methods have their own [XRPL Service](#xrpl-service) section.

| Namespace                              | Methods                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `client.domains`                       | `list`, `get`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Trusted domains                                                                                     |
| `client.endpoints`                     | `list`, `get`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Endpoints within a domain                                                                           |
| `client.accounts`                      | `list`, `get`, `addresses`, `allDomainsAddresses`, `getAccountAddress`, `generateNewExternalAddress`, `generateNewExternalAddressDeprecated`, `getLatestAddress`, `getAccountBalances`, `getConfirmedBalance`, `forceUpdateAccountBalances`, `getManifests`, `getManifest`, `listComplianceConfigurations`, `getComplianceConfiguration`, `upsertComplianceConfiguration`, `getTransferability`, `listDepositInstructions`, `getDepositInstruction`, `findByAddress`, `findByAddressOrThrow` | `findByAddress*` search across all domains; `getLatestAddress`/`getConfirmedBalance` are deprecated |
| `client.intents`                       | `propose`, `approve`, `reject`, `get`, `list`, `dryRun`, `remainingUsers`, `getAndWait`                                                                                                                                                                                                                                                                                                                                                                                                      | `getAndWait` polls to a terminal status                                                             |
| `client.transactions`                  | `orders`, `order`, `transfers`, `transfer`, `transactions`, `transaction`, `dryRun`                                                                                                                                                                                                                                                                                                                                                                                                          | Transaction orders, transfers, dry runs                                                             |
| `client.users`                         | `list`, `get`, `me`, `knownRoles`                                                                                                                                                                                                                                                                                                                                                                                                                                                            |                                                                                                     |
| `client.userInvitations`               | `list`, `get`, `create`, `fill`, `cancel`, `renew`, `complete`, `getPublic`                                                                                                                                                                                                                                                                                                                                                                                                                  | User invitation lifecycle                                                                           |
| `client.ledgers`                       | `list`, `get`, `fees`, `trusted`, `trustedList`, `processEthereumContractCall`                                                                                                                                                                                                                                                                                                                                                                                                               |                                                                                                     |
| `client.tickers`                       | `list`, `get`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                                                                     |
| `client.policies`                      | `list`, `get`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |                                                                                                     |
| `client.vaults`                        | `list`, `get`, `exportPreparedOperations`, `importPreparedOperations`                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                                                                     |
| `client.requests`                      | `state`, `userStates`, `userStatesInDomain`                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Request approval state                                                                              |
| `client.events`                        | `list`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Domain event log                                                                                    |
| `client.channels`                      | `list`, `get`, `create`, `update`, `delete`, `test`, `listEvents`, `getEvent`, `listAllEvents`                                                                                                                                                                                                                                                                                                                                                                                               | Webhook channels + event delivery                                                                   |
| `client.genesis`                       | `run`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Bootstrap a domain                                                                                  |
| `client.health`                        | `liveness`, `readiness`                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | app versions ≥ 1.36.1; `readiness()` is distinct from `RippleCustody.ready()` (the version guard)   |
| `client.systemProperties`              | `list`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | added in 2.6.0                                                                                      |
| `client.systemSigning`                 | `get`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |                                                                                                     |
| `client.backups`                       | `list`, `get`, `getTrustedEntity`                                                                                                                                                                                                                                                                                                                                                                                                                                                            | added in 2.6.0                                                                                      |
| `client.providers`                     | `list`, `get`, `getLocations`                                                                                                                                                                                                                                                                                                                                                                                                                                                                | added in 2.6.0                                                                                      |
| `client.trustedPublicKeys`             | `listTrustedCollection`, `listApi`, `listMessages`                                                                                                                                                                                                                                                                                                                                                                                                                                           | added in 2.6.0                                                                                      |
| `client.compliance.providers`          | `list`, `connect`, `getScreeningRules`, `configureScreeningRules`, `togglePreviewScreening`, `pauseConnection`, `deleteConnection`, `listConnections`                                                                                                                                                                                                                                                                                                                                        | added in 2.6.0                                                                                      |
| `client.compliance.policy`             | `create`, `get`, `getExceptionRole`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | added in 2.6.0                                                                                      |
| `client.compliance.domain`             | `create`, `delete`, `validate`                                                                                                                                                                                                                                                                                                                                                                                                                                                               | added in 2.6.0                                                                                      |
| `client.compliance.analysis`           | `analyze`, `preview`                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Transaction/wallet screening; added in 2.6.0                                                        |
| `client.compliance.travelRule`         | `createTransfer`, `getTransfer`, `appendPii`, `presentEncryptedPii`, `presentEncryptedPiiForPolicy`, `getDetails`, `listRelationships`, `createRelationship`                                                                                                                                                                                                                                                                                                                                 | IVMS-101 travel rule; added in 2.6.0                                                                |
| `client.sponsors`                      | `get`, `create`, `update`, `delete`, `list`, `getAccountSponsor`, `getDomainSponsor`, `listSponsoredAccounts`, `listSponsoredDomains`, `getSponsorableAccounts`, `getSponsorableDomains`, `addSponsoredAccounts`, `addSponsoredDomains`, `listEvents`                                                                                                                                                                                                                                        | Gas Station sponsorship; first-class namespace since 2.7.0                                          |
| `client.omnibus`                       | `get`, `getById`, `create`, `update`, `lock`, `unlock`, `listInternalTransfers`, `listDepositWallets`                                                                                                                                                                                                                                                                                                                                                                                        | Omnibus accounting; first-class namespace since 2.7.0                                               |
| `client.omnibus.tenants`               | `list`, `get`, `create`, `update`, `lock`, `unlock`, `createInternalTransfer`, `createWithdrawal`                                                                                                                                                                                                                                                                                                                                                                                            | Tenant sub-ledgers                                                                                  |
| `client.omnibus.tenants.depositWallet` | `get`, `create`                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Per-tenant deposit wallets                                                                          |
| `client.virtualLedgers`                | `list`, `create`, `get`, `update`, `getBalances`, `listOperations`, `createOperation`, `listTransfers`                                                                                                                                                                                                                                                                                                                                                                                       | Virtual ledger accounting                                                                           |
| `client.virtualLedgers.accounts`       | `list`, `create`, `update`, `getBalances`, `assignDepositIdentificationSource`, `getAddresses`                                                                                                                                                                                                                                                                                                                                                                                               | Per-account virtual ledger operations                                                               |
| `client.auth`                          | `getCurrentToken`, `getTokenExpiration`                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Current JWT token and its expiration                                                                |
| `client.xrpl`                          | `proposeIntent`, `rawSign`, `rawSignAndWait`, `dryRunBatch`, `signBatchPayload`, `signBatchPayloadAndWait`, `getBatchSignature`, `proposeBatch`, `getPublicKey`                                                                                                                                                                                                                                                                                                                              | See [XRPL Service](#xrpl-service)                                                                   |

## XRPL Service

The XRPL service provides a simplified, high-level API for creating XRPL transaction intents. Instead of manually building complex intent payloads, use `proposeIntent()` with a discriminated union — it handles user validation, domain resolution, and account lookup automatically.

### Usage

```typescript
// Propose any XRPL transaction — the `type` field selects the operation.
// TypeScript autocomplete shows available types and their fields.
await custody.xrpl.proposeIntent({
  Account: "rSenderAddress...",
  operation: {
    type: "Payment",
    destination: { address: "rDestAddress...", type: "Address" },
    amount: "1000000",
  },
})

// TrustSet
await custody.xrpl.proposeIntent({
  Account: "rSenderAddress...",
  operation: {
    type: "TrustSet",
    limitAmount: {
      currency: { code: "USD", type: "Currency", issuer: "rIssuer..." },
      value: "10000",
    },
    flags: [],
  },
})

// Raw sign and wait for signature
const { signature, signingPubKey } = await custody.xrpl.rawSignAndWait(autofilledTx)
```

### Examples

See the [`examples/`](./examples/) directory for working code.

#### XRPL examples

- [XRP Payment](./examples/xrpl/payment-xrp/) — send drops between accounts
- [MPToken Payment](./examples/xrpl/payment-mpt/) — send a Multi-Purpose Token
- [TrustSet](./examples/xrpl/trustset/) — set a trust line
- [MPToken Issuance Create](./examples/xrpl/mpt/create/) — create an MPToken issuance
- [MPToken Authorize](./examples/xrpl/mpt/authorize/) — authorize a holder for an MPToken
- [Regular Key MPToken Issuance](./examples/xrpl/regular-key-mpt-issuance/) — issue an MPToken with the master key disabled and a regular key active
- [Batch (multi-account)](./examples/xrpl/batch/multi-accounts/) — XLS-56 Batch across multiple inner accounts

#### Webhook examples

- [Create a channel](./examples/webhooks/create-channel/) — register a webhook channel for event delivery
- [Receive events](./examples/webhooks/receive-events/) — a Hono server that receives delivered webhook events

### Options

`proposeIntent()` and the raw-sign methods accept an optional second parameter with these options:

| Option                    | Type                          | Default | Description                                                                                          |
| ------------------------- | ----------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `domainId`                | `string`                      | -       | Domain ID (required if user has multiple domains)                                                    |
| `ledgerId`                | `XrplLedgerId`                | -       | XRPL ledger to use (`"xrpl"` or `"xrpl-testnet-august-2024"`) — required when the address spans both |
| `feePriority`             | `"Low" \| "Medium" \| "High"` | `"Low"` | Transaction fee priority                                                                             |
| `expiryDays`              | `number`                      | `1`     | Days until the intent expires                                                                        |
| `requestCustomProperties` | `Record<string, string>`      | `{}`    | Custom metadata on the request                                                                       |
| `payloadCustomProperties` | `Record<string, string>`      | `{}`    | Custom metadata on the payload                                                                       |
| `requestId`               | `string`                      | auto    | Override the auto-generated request ID                                                               |
| `payloadId`               | `string`                      | auto    | Override the auto-generated payload ID                                                               |

## Error Handling

The SDK throws `CustodyError` instances for all API errors:

```typescript
import { CustodyError } from "@florent-uzio/custody"

try {
  const domains = await custody.domains.list()
} catch (error) {
  if (error instanceof CustodyError) {
    console.log(error.message) // Main error reason
    console.log(error.statusCode) // HTTP status code (e.g., 400, 404)
    console.log(error.errorMessage) // Optional additional details from API
    console.log(error.cause) // Original error for debugging
    console.log(error.toJSON()) // Structured object for logging/serialization
  }
}
```

`console.log(error)` outputs a clean, readable format. Access `error.cause` for full debugging details.

## License

MIT License - see [LICENSE](./LICENSE) file for details.
