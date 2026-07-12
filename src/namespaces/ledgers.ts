import { URLs } from "../constants/urls.js"
import type {
  Core_CurrentFees,
  Core_EthereumCallResponse,
  Core_TrustedLedger,
  Core_TrustedLedgersCollection,
  GetLedgerFeePathParams,
  GetLedgerPathParams,
  GetLedgersQueryParams,
  GetTrustedLedgerPathParams,
  GetTrustedLedgersQueryParams,
  ProcessEthereumContractCallBody,
  ProcessEthereumContractCallPathParams,
} from "../services/ledgers/ledgers.types.js"
import type { TypedTransport } from "../transport/index.js"

export function createLedgers(t: TypedTransport) {
  return {
    list: (queryParams?: GetLedgersQueryParams): Promise<Core_TrustedLedgersCollection> =>
      t.get(URLs.ledgers, undefined, queryParams ?? {}),

    get: (params: GetLedgerPathParams): Promise<Core_TrustedLedger> => t.get(URLs.ledger, params),

    fees: (params: GetLedgerFeePathParams): Promise<Core_CurrentFees> =>
      t.get(URLs.ledgerFees, params),

    processEthereumContractCall: (
      params: ProcessEthereumContractCallPathParams,
      body: ProcessEthereumContractCallBody,
    ): Promise<Core_EthereumCallResponse> =>
      t.post(URLs.ledgerEthereumCall, body, params, { sign: false }),

    trusted: (params: GetTrustedLedgerPathParams): Promise<Core_TrustedLedger> =>
      t.get(URLs.trustedLedger, params),

    trustedList: (
      queryParams?: GetTrustedLedgersQueryParams,
    ): Promise<Core_TrustedLedgersCollection> =>
      t.get(URLs.trustedLedgers, undefined, queryParams ?? {}),
  } as const
}
