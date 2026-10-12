# Custody.js

A comprehensive JavaScript/Typescript SDK for interacting with the Ripple Custody API. This SDK provides a clean, type-safe interface for managing domains, intents, accounts, transactions, and cryptographic operations.

> **Do not use this SDK in production.** This is personal code that may contain bugs and is not regularly maintained. Fork it and update it as you wish.

## Features

- **Cryptographic Support**: Ed25519, secp256k1, secp256r1 keypair generation and signing
- **Domain Management**: List and retrieve domain information
- **Endpoint Management**: List and retrieve endpoints within a domain
- **Intent Operations**: Propose, approve, reject, and manage intents with built-in polling. `proposePayload()` builds the whole signed request envelope around a `v0_*` payload — author, expiry, ids and target domain — so no consumer assembles it by hand. See [Intents](./docs/intents.md)
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
- **Pagination**: Every `.list()` returns one page — `paginate()` walks the whole collection for you, so client-side filtering never reports a record as missing because it sat on page two. See [Pagination](#pagination)
- **Type Safety**: Full TypeScript support with types derived from the OpenAPI specification
- **Ledger ID Autocomplete**: `LedgerId`, `XrplLedgerId`, and `NonXrplLedgerId` exports give IDE autocomplete for the supported ledgers (e.g. `"ethereum"`, `"xrpl"`, `"solana"`, …) while still accepting any string — so newly added ledgers never break the SDK
- **XRPL Intent Proposal**: Single `proposeIntent()` method for all XRPL transaction types (Payment, TrustSet, DepositPreauth, Clawback, OfferCreate, AccountSet, TicketCreate, Batch, MPToken operations) using a type-safe discriminated union — or `proposeIntentAndWait()` to follow it all the way to the ledger in one call
- **Raw Signing**: Sign arbitrary XRPL transactions and Batch inner transactions via Custody

## Architecture

The SDK is built around a few key layers:

- **`TypedTransport`** — wraps the HTTP client with automatic URL template interpolation and path/query parameter splitting.
- **Namespace factories** (`createDomains`, `createAccounts`, etc.) — return plain objects that map method names to typed transport calls. Each factory is a thin, stateless function.
- **`RippleCustody`** — the public client class that assembles all namespaces in its constructor. Consumers interact exclusively through `client.domains.list()`, `client.accounts.get()`, etc.
- **`XrplService`** — builds XRPL transaction intents via a single `proposeIntent()` entry point (or `proposeIntentAndWait()`, which also follows the transaction to the ledger), handles domain/account resolution through injected I/O ports (`XrplPorts`), and supports raw signing with manifest polling.
- **Shared intent plumbing** — the request envelope (`buildRequestEnvelope`) and the domain/user resolution (`resolveDomainAndUser`) live with the `intents` and `domains` namespaces, so the namespaces and `XrplService` share one definition of each rather than restating them.

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

### Confidential MPTs

Confidential MPT support requires `xrpl@^5.1.0`, the first release carrying the
XLS-96 surface (`ConfidentialMPT*` transaction types,
`MPTokenIssuanceSetFlags.tfMPTSetCanHoldConfidentialBalance`, and the
`@xrplf/mpt-crypto` proof/ElGamal package). The SDK depends on it directly, so
no extra setup is needed.

If your application imports `xrpl` directly — to build a `Batch` or reference
any `ConfidentialMPT*` transaction type — make sure you install `xrpl@^5.1.0`
in your own project too. Earlier versions do not have those symbols.

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

#### Client options

| Option              | Type                            | Required | Default | Description                                                                                                                                                                                                                                                         |
| ------------------- | ------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apiUrl`            | `string`                        | Yes      | -       | API URL for the API endpoints (e.g. `"https://api.metaco.8rey62.m3t4c0.services"`)                                                                                                                                                                                  |
| `authUrl`           | `string`                        | Yes      | -       | Authentication URL for the API endpoints (e.g. `"https://auth.metaco.8rey62.m3t4c0.services"`)                                                                                                                                                                      |
| `privateKey`        | `string`                        | Yes\*    | -       | Private key (PEM) the SDK signs with internally. Provide exactly one of `privateKey` or `signer`                                                                                                                                                                    |
| `signer`            | `CustodySigner`                 | Yes\*    | -       | External signer `{ algorithm, sign }` that runs only the raw signing primitive, keeping the private key outside the SDK (e.g. HSM/KMS). Provide exactly one of `privateKey` or `signer`. See [External signer](#external-signer-hsmkms) below                       |
| `publicKey`         | `string`                        | Yes      | -       | Public key for authentication. Required in both signing modes                                                                                                                                                                                                       |
| `timeout`           | `number`                        | No       | `30000` | Request timeout in milliseconds                                                                                                                                                                                                                                     |
| `apiVersion`        | `KnownAppVersion`               | No       | -       | Pin the SDK to a specific Ripple Custody backend app version. Calls that version cannot serve throw `UnsupportedInVersionError`, gated against bundled capability data (no network). Only bundled versions are accepted, and setting this skips live auto-detection |
| `autoDetectVersion` | `boolean`                       | No       | `true`  | Auto-detect the backend's capabilities from its live OpenAPI spec on the first API call (cached thereafter). Ignored when `apiVersion` is set                                                                                                                       |
| `openApiUrl`        | `string`                        | No       | -       | Override the URL the live spec is fetched from during auto-detection. Defaults to `<apiUrl>/api/OpenAPI?scope=&layout=`. Useful for non-standard instances (e.g. devboxes)                                                                                          |
| `specSource`        | `SpecSource`                    | No       | -       | Advanced: fully override how the live spec is fetched during auto-detection (e.g. custom transport/proxy, or in tests). Takes precedence over `openApiUrl`                                                                                                          |
| `beforeSign`        | `BeforeSignHook`                | No       | -       | Escape hatch: reshape a request payload just before it is canonicalized and signed. Whatever it returns is both signed and sent. See [Signature failures on array fields](#signature-failures-on-array-fields)                                                      |
| `debug`             | `boolean \| CustodyDebugLogger` | No       | `false` | Log every HTTP exchange the SDK makes — API calls and auth token requests. `true` writes to `console.error`; a function receives structured events. See [Debug logging](#debug-logging)                                                                             |

\* Provide **exactly one** of `privateKey` or `signer`.

#### Debug logging

Set `debug` to see exactly what the SDK sends and receives. Both HTTP clients are
covered — the API client and the auth token endpoint — and each request is paired
with its response or error, carrying the status, duration, and error body.

```typescript
const custody = new RippleCustody({
  apiUrl: "https://api.ripple.com",
  authUrl: "https://auth.api.ripple.com/token",
  publicKey,
  privateKey,
  debug: true,
})
```

`true` writes to **`console.error`** (stderr), so diagnostics never mix into a
program's stdout — which matters if you pipe your own output anywhere. Note that
`console.debug` and `console.info` both write to _stdout_ in Node, so neither is
an option here:

```
[custody:auth] → POST https://auth.api.ripple.com/token { "headers": { … }, "body": { "grant_type": "password", "signature": "MEQCIC…", … } }
[custody:auth] ← 200 POST https://auth.api.ripple.com/token (112ms) { "body": { "access_token": "<redacted>", … } }
[custody:api]  → POST https://api.ripple.com/v1/intents { "headers": { "Authorization": "Bearer <redacted>", … }, "body": { … } }
[custody:api]  ← 401 POST https://api.ripple.com/v1/intents (89ms) — Request failed with status code 401 { "body": { "reason": "InvalidSignatureError" } }
```

Credentials are always masked, in both forms: the `Authorization` request header
and the `access_token` / `id_token` / `refresh_token` response fields. Everything
else is verbatim — including the auth request's `signature`, which is bound to a
single challenge and is what you need when debugging a signature failure.

To route diagnostics into your own logger, pass a `CustodyDebugLogger` instead. It
receives a structured `CustodyDebugEvent`, discriminated on `kind`:

```typescript
import { RippleCustody, type CustodyDebugEvent } from "@florent-uzio/custody"

const custody = new RippleCustody({
  // …
  debug: (event: CustodyDebugEvent) => {
    // event.client is "api" | "auth"; event.kind is "request" | "response" | "error"
    if (event.kind === "error") logger.error({ ...event }, "custody request failed")
    else logger.debug({ ...event })
  },
})
```

This is also the way to control severity: log collectors often tag anything on
stderr as error-level, so if `debug: true` makes your dashboards noisy, pass a
logger that emits at the level you want instead.

Note that `event.url` is the **resolved** absolute URL (`…/v1/domains/d-123/accounts`),
not the `/v1/domains/{domainId}/accounts` template — path parameters are
interpolated before the request is dispatched. Group events by URL with that in
mind.

The logger is called synchronously on the request path, so keep it cheap. A logger
that throws is ignored rather than allowed to fail the request.

#### External signer (HSM/KMS)

Instead of handing the SDK a raw `privateKey`, provide a `signer` so the private
key never enters the SDK. The SDK owns canonicalization, hashing, and signature
encoding; your signer runs **only the raw cryptographic primitive** for its
`algorithm` over the `data` bytes the SDK provides, and returns the raw signature
bytes. It may be async, and receives a `context` so HSM/KMS policy engines can
gate per-operation.

Raw-signature contract by algorithm (must match your registered `publicKey`):

| `algorithm`             | What `data` is                                                   | Return                                     |
| ----------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| `ed25519`               | already SHA-256 hashed for request bodies; raw for the challenge | the **64-byte raw** Ed25519 signature      |
| `secp256k1`/`secp256r1` | the UTF-8 message bytes (ECDSA applies SHA-256 itself)           | the **DER-encoded** ECDSA-SHA256 signature |

```typescript
import { type CustodySigner, RippleCustody } from "@florent-uzio/custody"

const signer: CustodySigner = {
  algorithm: "secp256k1",
  // `data` is the exact bytes to sign; `context` is "auth-challenge" | "request-body".
  sign: async ({ data, context }) => {
    // Delegate the raw primitive to your HSM/KMS; return the raw signature bytes.
    return await myHsm.signEcdsaSha256Der(data)
  },
}

const custody = new RippleCustody({
  apiUrl: "https://api.ripple.com",
  authUrl: "https://auth.api.ripple.com/token",
  publicKey: myPublicKey, // base64 DER
  signer,
})
```

> **AWS KMS note:** `Sign` caps `RAW` messages at 4096 bytes. For an ECDSA
> (`secp256k1`/`secp256r1`) signer, a large canonical request body can exceed
> that limit, so hash `data` locally and call KMS with `MessageType: DIGEST`,
> passing `sha256(data)` with `ECDSA_SHA_256` (this yields the same signature as
> a `RAW` sign over `data`). Do **not** send an ed25519 `request-body` `data` as
> `DIGEST` — it is already the SHA-256 hash and ed25519 signs it as-is.

`canonicalizeRequest(request)` is exported for inspecting the canonical JSON the
SDK signs for a request body. Note it returns the **pre-hash input**, not the final
signed bytes — pass it to the also-exported `prepareSigningInput(algorithm, message, context)`
to get the exact bytes the raw signing primitive runs over (e.g. for fully
out-of-band signing). See `examples/external-signer/index.ts` for a runnable
signer example, and `examples/external-signer/inspect-signing-input.ts` for a
standalone example of inspecting the signing input without making a network call.

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
// Propose a `v0_*` payload — the SDK builds the signed request envelope
// (author, expiryAt, id, targetDomainId, customProperties) around it.
const { requestId, domainId } = await custody.intents.proposePayload(
  { type: "v0_ReleaseQuarantinedTransfers", accountId: "account-id", transferIds: ["transfer-id"] },
  { description: "Release the transfers held for review", expiryDays: 7 },
)

// `intents.propose` remains the raw escape hatch when you assemble it yourself
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
} else {
  // One sentence saying why — undefined exactly when `isSuccess` is true
  console.log(result.reason)
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

// Wait for the transaction a transaction order produced. An intent reporting
// `Executed` only means custody accepted the order, not that it reached the
// ledger — `isSuccess` requires both, and `reason` says why when it is false.
const tx = await custody.transactions.byOrderAndWait({
  domainId: "domain-id",
  transactionOrderId: "payload-id",
})

// User Operations
const me = await custody.users.me()
const users = await custody.users.list({ domainId: "domain-id" })

// The domain and user you are acting as, resolved from `/v1/me` — the ids
// almost every other call needs, without the domain lookup by hand
const { domainId: myDomainId, userId } = await custody.domains.me()

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

Every namespace is wired on the `RippleCustody` client. The Quick Start above
shows the most common ones; the full surface — every namespace and its
methods — is documented in [`docs/namespaces.md`](./docs/namespaces.md). XRPL
and Batch signing methods have their own [XRPL Service](#xrpl-service) section.

Every write goes through an intent, and proposing one spans several namespaces
at once. [`docs/intents.md`](./docs/intents.md) covers that lifecycle end to
end: the two stages and why `Executed` does not mean the transaction landed,
which propose method to reach for, the request id vs payload id distinction,
how to read a failure, and why the waiting variants are the wrong tool for
approval-gated production flows.

Namespaces under `client.internal.*` target the instance's **internal** API
instead of the customer-facing one. They are meant for internal tooling: not
covered by the public API's compatibility promises, and only version-gated on
instances that serve the internal OpenAPI document. See [Internal
namespaces](./docs/namespaces.md#internal-namespaces).

## Pagination

**Every `.list()`-style method returns exactly one page.** Nothing in the
response makes that obvious at the call site, so code that lists a collection and
filters `.items` itself will silently conclude a record does not exist as soon as
the collection outgrows one page — no error, no warning, just a `.find()` that
returns `undefined`.

`paginate` closes that gap. It follows the `nextStartingAfter` cursor until the
server stops issuing one, and yields items:

```ts
import { paginate } from "@florent-uzio/custody"

const fetchTickers = (startingAfter) => custody.tickers.list({ limit: 100, startingAfter })

// find one, stop early — no further requests go out after the break
for await (const ticker of paginate(fetchTickers)) {
  if (ticker.ledgerId === "xrpl-testnet") {
    console.log("found", ticker.id)
    break
  }
}
```

It takes a callback rather than a method reference, because it has to inject the
cursor into a query the caller owns — and list methods differ in arity
(`tickers.list(query)` vs `accounts.getAccountBalances(params, query)`). The same
callback shape works for both:

```ts
const fetchBalances = (startingAfter) =>
  custody.accounts.getAccountBalances({ domainId, accountId }, { limit: 100, startingAfter })

for await (const balance of paginate(fetchBalances)) {
  console.log(balance)
}
```

To collect everything, drain it:

```ts
const allTickers: Core_ApiTicker[] = []
for await (const ticker of paginate(fetchTickers)) {
  allTickers.push(ticker)
}
```

(`await Array.fromAsync(paginate(…))` does the same in one line if your
`tsconfig` `lib` includes it — it is `esnext` in TypeScript's layout, so it is not
available under a plain `es2024` target even though Node ≥ 22 implements it.)

Notes:

- **Pass `limit` yourself.** `paginate` only ever sets `startingAfter`, because
  the documented maximum varies by endpoint (100 on most, 1000 on a couple).
  `limit: 100` cuts round trips substantially.
- **Pages are fetched lazily** — the request for the next page only goes out once
  the current page's items are exhausted, so `break` and `return` cost nothing.
- **Draining is unbounded.** Collecting a large collection pulls all of it into
  memory; prefer `for await` with an early exit when you can.
- **A stalled cursor throws.** If the server returns the same cursor it was
  given, `paginate` raises a `CustodyError` rather than looping forever.
- Not every list is cursor-paginated: `omnibus.tenants.list` and
  `domains.sweepThresholds` page by offset, and `channels.*` / `requests.*`
  return plain arrays. `paginate` does not apply to those, and will not typecheck
  against them.

Design rationale, including why there is no `custody.tickers.paginate()` and no
`listAll()`, is in [ADR-0008](./docs/adr/0008-cursor-pagination.md).

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

`proposeIntentAndWait()` does the same as `proposeIntent()` and then follows the
transaction to the ledger — both waits in one call, so there is no
`intents.getAndWait` → `transactions.byOrderAndWait` chain to write:

```typescript
const result = await custody.xrpl.proposeIntentAndWait(
  {
    Account: "rSenderAddress...",
    operation: {
      type: "Payment",
      destination: { address: "rDestAddress...", type: "Address" },
      amount: "1000000",
    },
  },
  // Each stage polls separately — they wait on different things: custody
  // accepting the order, then the ledger. Both default to 10 attempts, 3s apart.
  { transaction: { maxRetries: 20 } },
)

if (result.isSuccess) {
  // Completed *and* the ledger accepted it — safe to build the next transaction on
  console.dir(result.transaction, { depth: null })
} else if (!result.intent.isSuccess) {
  // The intent never executed, so no transaction was ever created
  console.log("Intent did not execute:", result.intent.status)
} else {
  console.log(result.reason)
}
```

The top level of the result **is** `transactions.byOrderAndWait`'s — `status`,
`isTerminal`, `isSuccess`, `transaction`, `reason` — with the intent stage on
`result.intent` and the resolved `requestId` / `payloadId` / `domainId`
alongside. The transaction stage is skipped when the intent does not execute:
no transaction is coming, so there is nothing to wait for.

Nothing here throws on a rejected intent or a failed transaction — the outcome
is the return value.

> **The `…AndWait` methods are the wrong tool for approval-gated production
> flows.** Polling defaults to 10 attempts 3s apart — 30 seconds — and a
> custodian approving an intent by hand can take minutes, so these will honestly
> return `{ isTerminal: false, status: "Open" }`: still waiting on a human, not
> a failure. Raising `maxRetries` does not fix it; no polling budget is right
> for a person. Propose without waiting, keep the ids, and pick the intent up
> from `client.channels` or `client.events` when the approval lands. See
> [Intents](./docs/intents.md).

### Examples

See the [`examples/`](./examples/) directory for working code.

#### XRPL examples

- [XRP Payment](./examples/xrpl/payment-xrp/) — send drops between accounts
- [MPToken Payment](./examples/xrpl/payment-mpt/) — send a Multi-Purpose Token
- [TrustSet](./examples/xrpl/trustset/) — set a trust line
- [MPToken Issuance Create](./examples/xrpl/mpt/create/) — create an MPToken issuance
- [MPToken Authorize](./examples/xrpl/mpt/authorize/) — authorize a holder for an MPToken
- [MPToken Issuance Create with 5 flags](./examples/xrpl/mpt/create-five-flags/) — work around the backend's [signature failure on 5+ flags](#signature-failures-on-array-fields) with `beforeSign`
- [Regular Key MPToken Issuance](./examples/xrpl/regular-key-mpt-issuance/) — issue an MPToken with the master key disabled and a regular key active
- [Batch (multi-account)](./examples/xrpl/batch/multi-accounts/) — XLS-56 Batch across multiple inner accounts
- [Propose and wait](./examples/xrpl/propose-and-wait/) — follow a payment to the ledger in one call, and read the two failure branches apart

#### Intent examples

- [Release quarantined transfers](./examples/intents/release-quarantined-transfers/) — propose a non-XRPL `v0_*` intent without assembling the envelope, and why to prefer `proposePayload` in production

#### Webhook examples

- [Create a channel](./examples/webhooks/create-channel/) — register a webhook channel for event delivery
- [Receive events](./examples/webhooks/receive-events/) — a Hono server that receives delivered webhook events

Ripple Custody does not sign or otherwise authenticate webhook deliveries — a
channel's `url` is the only delivery target, with no secret, key, or signature
field. To authenticate inbound requests, embed a secret of your own in the
registered URL (e.g. `?token=...`) and verify it with `verifyWebhookSecret` on
receipt, as the examples above do. Without this check, any request to your
webhook route is treated as a genuine Custody event.

### Options

`proposeIntent()` and the raw-sign methods accept an optional second parameter with these options:

| Option                    | Type                          | Default | Description                                                                                          |
| ------------------------- | ----------------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `domainId`                | `string`                      | -       | Domain ID (required if user has multiple domains)                                                    |
| `ledgerId`                | `XrplLedgerId`                | -       | XRPL ledger to use (`"xrpl"` or `"xrpl-testnet-august-2024"`) — required when the address spans both |
| `feePriority`             | `"Low" \| "Medium" \| "High"` | `"Low"` | Transaction fee priority                                                                             |
| `expiryDays`              | `number`                      | `1`     | Days until the intent expires                                                                        |
| `description`             | `string`                      | -       | Human-readable description on the request (`request.description`)                                    |
| `requestCustomProperties` | `Record<string, string>`      | `{}`    | Custom metadata on the request                                                                       |
| `payloadCustomProperties` | `Record<string, string>`      | `{}`    | Custom metadata on the payload                                                                       |
| `requestId`               | `string`                      | auto    | Override the auto-generated request ID                                                               |
| `payloadId`               | `string`                      | auto    | Override the auto-generated payload ID                                                               |

The first four are the envelope options every intent shares, so
`intents.proposePayload()` and `intents.proposeAndWait()` take them too. The
rest are specific to a transaction order.

`proposeIntent()`, `rawSign()` and `proposeBatch()` return the intent response
plus the `payloadId` the intent was proposed under, so follow-up lookups need no
pre-generated UUID:

```typescript
const { requestId, payloadId } = await custody.xrpl.proposeIntent({
  Account: "rIssuer...",
  operation: { type: "MPTokenIssuanceCreate", assetScale: 2, maximumAmount: "1000", flags: [] },
})

await custody.intents.getAndWait({ domainId, intentId: requestId })
const issuanceId = await custody.xrpl.getMptIssuanceIdAndWait({ domainId, payloadId })
```

The two ids are **not** interchangeable: `requestId` identifies the _intent_
(poll and approve by it), `payloadId` identifies the _transaction order_ inside
it (look the resulting transaction up by it, where it appears as
`orderReference.Id`). Both default to a generated UUID v7 and both come back, so
you never have to pre-mint one to learn what the SDK is about to use.

## Error Handling

The SDK throws `CustodyError` instances for all API errors:

```typescript
import { CustodyError } from "@florent-uzio/custody"

try {
  const domains = await custody.domains.list()
} catch (error) {
  if (error instanceof CustodyError) {
    console.log(error.reason) // The API's failure reason, on its own
    console.log(error.message) // The reason, plus any `hint` — what stack traces show
    console.log(error.hint) // Optional SDK diagnostic the API's reason doesn't explain
    console.log(error.statusCode) // HTTP status code (e.g., 400, 404)
    console.log(error.errorMessage) // Optional additional details from API
    console.log(error.cause) // Original error for debugging
    console.log(error.toJSON()) // Structured object for logging/serialization
  }
}
```

`console.log(error)` outputs a clean, readable format. Access `error.cause` for
full debugging details. Group or compare errors on `error.reason` rather than
`error.message`: a `hint` can carry request-specific details, and it is appended
to `message` so it survives into stack traces and unhandled rejections.

### Signature failures on array fields

A known Ripple Custody **backend** defect makes some signed requests fail with
`401 InvalidSignatureError`. The API deserializes certain array fields into an
unordered set and re-serializes that set when verifying the request-body
signature. Up to four elements the set keeps insertion order and the round-trip
is faithful; at five or more it is hash-ordered and re-emitted in one fixed
order, so the server verifies different bytes than the SDK signed. The known
case is `MPTokenIssuanceCreate.flags` with 5+ flags.

The SDK does not reorder anything — JCS (RFC 8785) preserves array order by
design, and the SDK signs exactly the bytes it puts on the wire. Instead, when a
signed POST fails with a 401 signature error, `error.hint` names the array fields
large enough to have caused it:

```
The signed body contains array field(s) with 5+ elements
(`request.payload.parameters.operation.flags`). The API may re-serialize set-typed
fields in a different order than sent, which breaks signature verification. ...
```

Until the backend verifies over the received bytes, applications that need such
a request to go through can reorder the field themselves with the `beforeSign`
client option. It runs on signed POST bodies only, just before canonicalization,
and whatever it returns is both signed and sent — so the signed bytes stay the
bytes on the wire. Because XRPL flags collapse to a bitmask, reordering them is
semantically lossless.

The hook receives the exported `CustodySignedRequest` union — intent `Propose`,
`Approve` and `Reject` are the only signed bodies — so narrowing on `type` (then
`payload.type` and `parameters.type`) gives full autocomplete down to the XRPL
operation. Return the request untouched for anything the hook does not handle.

See [MPToken Issuance Create with 5 flags](./examples/xrpl/mpt/create-five-flags/)
for a runnable example that sorts `flags` into the order the backend re-emits.
Tracking issue: [#223](https://github.com/florent-uzio/custody.js/issues/223).

### Version-gated calls

When `apiVersion` is set (or `autoDetectVersion` resolves a live version), the
SDK gates calls against that version's bundled/detected capabilities. Calling a
method the resolved backend version does not support throws
`UnsupportedInVersionError` instead of making a network request:

```typescript
import { UnsupportedInVersionError } from "@florent-uzio/custody"

try {
  await custody.health.liveness()
} catch (error) {
  if (error instanceof UnsupportedInVersionError) {
    console.log(error.capability) // e.g. "GET /health/liveness" or a schema name
    console.log(error.kind) // "endpoint" | "feature"
    console.log(error.appVersion) // the resolved backend version
    console.log(error.sdkMethod) // the SDK method that was called
  }
}
```

`UnsupportedInVersionError` extends `CustodyError`, so existing
`catch (error instanceof CustodyError)` handlers still catch it. If no version
can be resolved (detection fails, or neither `apiVersion` nor
`autoDetectVersion` produced a resolved version), the SDK fails open — calls
pass through and the backend remains the ultimate authority.

## License

MIT License - see [LICENSE](./LICENSE) file for details.
