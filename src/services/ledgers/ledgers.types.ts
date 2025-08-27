import type { operations } from "../../models/custody-types.js"

// Request types

export type GetLedgersQueryParams = operations["getLedgers"]["parameters"]["query"]

export type GetLedgerPathParams = operations["getLedger"]["parameters"]["path"]

export type GetLedgerFeePathParams = operations["getLedgerFees"]["parameters"]["path"]

export type ProcessEthereumContractCallPathParams =
  operations["processEthereumContractCall"]["parameters"]["path"]
export type ProcessEthereumContractCallBody =
  operations["processEthereumContractCall"]["requestBody"]["content"]["application/json"]

export type GetTrustedLedgerPathParams = operations["getTrustedLedger"]["parameters"]["path"]

export type GetTrustedLedgersQueryParams = operations["getTrustedLedgers"]["parameters"]["query"]

// Response types

export type Core_TrustedLedgersCollection =
  operations["getLedgers"]["responses"]["200"]["content"]["application/json"]

export type Core_TrustedLedger =
  operations["getLedger"]["responses"]["200"]["content"]["application/json"]

export type Core_CurrentFees =
  operations["getLedgerFees"]["responses"]["200"]["content"]["application/json"]

export type Core_EthereumCallResponse =
  operations["processEthereumContractCall"]["responses"]["200"]["content"]["application/json"]
