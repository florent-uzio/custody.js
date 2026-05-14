/**
 * Known ledger IDs for the XRPL namespace. Trailing `(string & {})` keeps
 * the union assignable from any string, so the SDK never blocks consumers
 * when the API adds a new XRPL ledger.
 */
export type XrplLedgerId = "xrpl" | "xrpl-testnet-august-2024" | (string & {})

/**
 * Known ledger IDs for non-XRPL namespaces. Trailing `(string & {})` keeps
 * the union assignable from any string, so the SDK never blocks consumers
 * when the API adds a new ledger.
 */
export type NonXrplLedgerId =
  | "optimism"
  | "optimism-testnet-sepolia"
  | "arbitrum"
  | "arbitrum-testnet-sepolia"
  | "polkadot-assethub"
  | "substrate-westend-assethub"
  | "bitcoin-testnet4"
  | "ethereum-testnet-hoodi"
  | "algorand"
  | "algorand-testnet"
  | "avalanche-c-chain"
  | "avalanche-c-chain-testnet-fuji"
  | "bitcoin"
  | "bitcoin-cash"
  | "bitcoin-cash-testnet"
  | "bitcoin-testnet"
  | "bsc"
  | "bsc-testnet"
  | "cardano"
  | "cardano-testnet-preprod"
  | "dash"
  | "dash-testnet"
  | "dogecoin"
  | "dogecoin-testnet"
  | "ethereum"
  | "ethereum-testnet-sepolia"
  | "hedera"
  | "hedera-testnet-january-2024"
  | "litecoin"
  | "litecoin-testnet"
  | "polkadot"
  | "polygon"
  | "polygon-testnet-amoy"
  | "solana"
  | "solana-devnet"
  | "stellar"
  | "stellar-testnet-december-2025"
  | "substrate-westend"
  | "tezos"
  | "tezos-testnet-ithaca"
  | "tron"
  | "tron-testnet"
  | (string & {})

/**
 * Union of all known ledger IDs. Use for namespace-agnostic lookups
 * (e.g. `accounts.findByAddress`). For XRPL-only operations prefer
 * {@link XrplLedgerId}; for non-XRPL operations prefer {@link NonXrplLedgerId}.
 */
export type LedgerId = XrplLedgerId | NonXrplLedgerId
