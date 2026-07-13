import {
  AccountSetAsfFlags,
  type Batch,
  BatchFlags,
  type BatchSigner,
  type IssuedCurrencyAmount,
  MPTokenAuthorizeFlags,
  MPTokenIssuanceCreateFlags,
  MPTokenIssuanceSetFlags,
  OfferCreateFlags,
  TrustSetFlags,
} from "xrpl"
import { isString, isUndefined } from "../../helpers/index.js"
import { CustodyError } from "../../models/index.js"
import type {
  BatchPayloadInput,
  Core_BatchExecutionMode,
  Core_ParticipantSequencing,
  CustodyAccountSetFlag,
  CustodyBatchSigner,
  CustodyInnerTransaction,
  CustodyMpTokenIssuanceCreate,
  CustodyOperation,
} from "./xrpl.types.js"

type RawTx = Batch["RawTransactions"][number]["RawTransaction"]

// XRP drops are represented as plain strings; IOU amounts carry currency/issuer metadata.
const amountToAssetQuantity = (amount: IssuedCurrencyAmount | string) => {
  if (typeof amount === "string") {
    return { amount }
  }
  return {
    amount: amount.value,
    currency: {
      type: "Currency" as const,
      code: amount.currency,
      issuer: amount.issuer,
    },
  }
}

// XRPL flags can arrive either as a bitmask integer or as a pre-decoded object
// (e.g. { tfSell: true }). Both forms are handled throughout the flag helpers below.
const offerCreateFlagsToStrings = (
  flags?: number | object,
): ("tfImmediateOrCancel" | "tfFillOrKill" | "tfSell")[] => {
  if (!flags) return []
  if (typeof flags === "object") {
    const f = flags as Record<string, boolean>
    return (["tfImmediateOrCancel", "tfFillOrKill", "tfSell"] as const).filter((k) => f[k])
  }
  const result: ("tfImmediateOrCancel" | "tfFillOrKill" | "tfSell")[] = []
  if (flags & OfferCreateFlags.tfImmediateOrCancel) result.push("tfImmediateOrCancel")
  if (flags & OfferCreateFlags.tfFillOrKill) result.push("tfFillOrKill")
  if (flags & OfferCreateFlags.tfSell) result.push("tfSell")
  return result
}

const trustSetFlagsToStrings = (
  flags?: number | object,
): ("tfSetFreeze" | "tfClearFreeze" | "tfSetfAuth")[] => {
  if (!flags) return []
  if (typeof flags === "object") {
    const f = flags as Record<string, boolean>
    return (["tfSetfAuth", "tfSetFreeze", "tfClearFreeze"] as const).filter((k) => f[k])
  }
  const result: ("tfSetFreeze" | "tfClearFreeze" | "tfSetfAuth")[] = []
  if (flags & TrustSetFlags.tfSetfAuth) result.push("tfSetfAuth")
  if (flags & TrustSetFlags.tfSetFreeze) result.push("tfSetFreeze")
  if (flags & TrustSetFlags.tfClearFreeze) result.push("tfClearFreeze")
  return result
}

const ASF_FLAG_MAP: Partial<Record<AccountSetAsfFlags, CustodyAccountSetFlag>> = {
  [AccountSetAsfFlags.asfRequireDest]: "asfRequireDest",
  [AccountSetAsfFlags.asfRequireAuth]: "asfRequireAuth",
  [AccountSetAsfFlags.asfAccountTxnID]: "asfAccountTxnID",
  [AccountSetAsfFlags.asfNoFreeze]: "asfNoFreeze",
  [AccountSetAsfFlags.asfGlobalFreeze]: "asfGlobalFreeze",
  [AccountSetAsfFlags.asfDefaultRipple]: "asfDefaultRipple",
  [AccountSetAsfFlags.asfDepositAuth]: "asfDepositAuth",
  [AccountSetAsfFlags.asfAllowTrustLineClawback]: "asfAllowTrustLineClawback",
}

const accountSetAsfFlagToString = (flag: number): CustodyAccountSetFlag => {
  const mapped = ASF_FLAG_MAP[flag as AccountSetAsfFlags]
  if (!mapped) throw new Error(`Unsupported AccountSet flag: ${flag}`)
  return mapped
}

const mpTokenAuthorizeFlagsToStrings = (flags?: number | object): "tfMPTUnauthorize"[] => {
  if (!flags) return []
  if (typeof flags === "object") {
    const f = flags as Record<string, boolean>
    return (["tfMPTUnauthorize"] as const).filter((k) => f[k])
  }
  const result: "tfMPTUnauthorize"[] = []
  if (flags & MPTokenAuthorizeFlags.tfMPTUnauthorize) result.push("tfMPTUnauthorize")
  return result
}

type MPTokenIssuanceCreateFlag = CustodyMpTokenIssuanceCreate["flags"][number]

const mpTokenIssuanceCreateFlagsToStrings = (
  flags?: number | object,
): MPTokenIssuanceCreateFlag[] => {
  if (!flags) return []
  if (typeof flags === "object") {
    const f = flags as Record<string, boolean>
    return (
      [
        "tfMPTCanLock",
        "tfMPTRequireAuth",
        "tfMPTCanEscrow",
        "tfMPTCanTrade",
        "tfMPTCanTransfer",
        "tfMPTCanClawback",
      ] as const
    ).filter((k) => f[k])
  }
  const result: MPTokenIssuanceCreateFlag[] = []
  if (flags & MPTokenIssuanceCreateFlags.tfMPTCanLock) result.push("tfMPTCanLock")
  if (flags & MPTokenIssuanceCreateFlags.tfMPTRequireAuth) result.push("tfMPTRequireAuth")
  if (flags & MPTokenIssuanceCreateFlags.tfMPTCanEscrow) result.push("tfMPTCanEscrow")
  if (flags & MPTokenIssuanceCreateFlags.tfMPTCanTrade) result.push("tfMPTCanTrade")
  if (flags & MPTokenIssuanceCreateFlags.tfMPTCanTransfer) result.push("tfMPTCanTransfer")
  if (flags & MPTokenIssuanceCreateFlags.tfMPTCanClawback) result.push("tfMPTCanClawback")
  return result
}

const mpTokenIssuanceSetFlagsToStrings = (
  flags?: number | object,
): ("tfMPTLock" | "tfMPTUnlock")[] => {
  if (!flags) return []
  if (typeof flags === "object") {
    const f = flags as Record<string, boolean>
    return (["tfMPTLock", "tfMPTUnlock"] as const).filter((k) => f[k])
  }
  const result: ("tfMPTLock" | "tfMPTUnlock")[] = []
  if (flags & MPTokenIssuanceSetFlags.tfMPTLock) result.push("tfMPTLock")
  if (flags & MPTokenIssuanceSetFlags.tfMPTUnlock) result.push("tfMPTUnlock")
  return result
}

const txToOperation = (tx: RawTx): CustodyOperation => {
  switch (tx.TransactionType) {
    case "Payment": {
      const amount = tx.Amount
      if (isString(amount)) {
        // XRP drops
        return {
          type: "Payment",
          destination: { type: "Address", address: tx.Destination },
          amount,
          ...(tx.DestinationTag !== undefined && { destinationTag: tx.DestinationTag }),
        }
      }
      const isMPT = "mpt_issuance_id" in amount
      return {
        type: "Payment",
        destination: { type: "Address", address: tx.Destination },
        amount: amount.value,
        ...(tx.DestinationTag !== undefined && { destinationTag: tx.DestinationTag }),
        currency: isMPT
          ? { type: "MultiPurposeToken" as const, issuanceId: amount.mpt_issuance_id }
          : {
              type: "Currency" as const,
              code: (amount as IssuedCurrencyAmount).currency,
              issuer: (amount as IssuedCurrencyAmount).issuer,
            },
      }
    }
    case "OfferCreate":
      return {
        type: "OfferCreate",
        takerGets: amountToAssetQuantity(tx.TakerGets as IssuedCurrencyAmount | string),
        takerPays: amountToAssetQuantity(tx.TakerPays as IssuedCurrencyAmount | string),
        flags: offerCreateFlagsToStrings(tx.Flags),
      }
    case "TrustSet":
      return {
        type: "TrustSet",
        limitAmount: {
          currency: {
            type: "Currency",
            code: tx.LimitAmount.currency,
            issuer: tx.LimitAmount.issuer,
          },
          value: tx.LimitAmount.value,
        },
        flags: trustSetFlagsToStrings(tx.Flags),
      }
    case "AccountSet":
      return {
        type: "AccountSet",
        ...(tx.SetFlag !== undefined && { setFlag: accountSetAsfFlagToString(tx.SetFlag) }),
        ...(tx.ClearFlag !== undefined && { clearFlag: accountSetAsfFlagToString(tx.ClearFlag) }),
        ...(tx.TransferRate !== undefined && { transferRate: tx.TransferRate }),
      }
    case "TicketCreate":
      return {
        type: "TicketCreate",
        ticketCount: tx.TicketCount,
      }
    case "Clawback": {
      const amount = tx.Amount
      // Clawback Amount can be either an IOU (IssuedCurrencyAmount) or an MPT amount,
      // distinguished by the presence of `mpt_issuance_id`.
      const isMPT = "mpt_issuance_id" in amount
      return {
        type: "Clawback",
        currency: isMPT
          ? { type: "MultiPurposeToken" as const, issuanceId: amount.mpt_issuance_id }
          : {
              type: "Currency" as const,
              code: (amount as IssuedCurrencyAmount).currency,
              issuer: (amount as IssuedCurrencyAmount).issuer,
            },
        holder: { type: "Address" as const, address: tx.Holder as string },
        value: amount.value,
      }
    }
    case "DepositPreauth":
      return {
        type: "DepositPreauth",
        ...(tx.Authorize !== undefined && {
          authorize: { type: "Address" as const, address: tx.Authorize },
        }),
        ...(tx.Unauthorize !== undefined && {
          unauthorize: { type: "Address" as const, address: tx.Unauthorize },
        }),
      }
    case "EscrowFinish":
      return {
        type: "EscrowFinish",
        owner: { type: "Address" as const, address: tx.Owner },
        offerSequence: Number(tx.OfferSequence),
        ...(tx.Condition !== undefined && { condition: tx.Condition }),
        ...(tx.Fulfillment !== undefined && { fulfillment: tx.Fulfillment }),
        ...(tx.CredentialIDs !== undefined && { credentialIds: tx.CredentialIDs }),
      }
    case "MPTokenAuthorize":
      return {
        type: "MPTokenAuthorize",
        tokenIdentifier: { type: "MPTokenIssuanceId" as const, issuanceId: tx.MPTokenIssuanceID },
        flags: mpTokenAuthorizeFlagsToStrings(tx.Flags),
        ...(tx.Holder !== undefined && {
          holder: { type: "Address" as const, address: tx.Holder },
        }),
      }
    case "MPTokenIssuanceCreate":
      return {
        type: "MPTokenIssuanceCreate",
        flags: mpTokenIssuanceCreateFlagsToStrings(tx.Flags),
        ...(tx.AssetScale !== undefined && { assetScale: tx.AssetScale }),
        ...(tx.TransferFee !== undefined && { transferFee: tx.TransferFee }),
        ...(tx.MaximumAmount !== undefined && { maximumAmount: tx.MaximumAmount }),
        ...(tx.MPTokenMetadata !== undefined && {
          metadata: { type: "HexEncodedMetadata" as const, value: tx.MPTokenMetadata },
        }),
      }
    case "MPTokenIssuanceDestroy":
      return {
        type: "MPTokenIssuanceDestroy",
        tokenIdentifier: { type: "MPTokenIssuanceId" as const, issuanceId: tx.MPTokenIssuanceID },
      }
    case "MPTokenIssuanceSet":
      return {
        type: "MPTokenIssuanceSet",
        tokenIdentifier: { type: "MPTokenIssuanceId" as const, issuanceId: tx.MPTokenIssuanceID },
        flags: mpTokenIssuanceSetFlagsToStrings(tx.Flags),
        ...(tx.Holder !== undefined && {
          holder: { type: "Address" as const, address: tx.Holder },
        }),
      }
    default:
      throw new Error(`Unsupported transaction type: ${tx.TransactionType}`)
  }
}

/**
 * Converts an XRPL SDK BatchSigners array (from a signed Batch transaction)
 * to the batchSigners format required by the Ripple Custody API.
 */
export const batchSignersToCustodyBatchSigners = (
  batchSigners: BatchSigner[],
): CustodyBatchSigner[] => {
  return batchSigners.map(({ BatchSigner: { Account, SigningPubKey, TxnSignature } }) => ({
    participant: {
      address: Account,
      type: "Address",
    },
    publicKey: SigningPubKey ?? "",
    signature: TxnSignature ?? "",
  }))
}

/**
 * Maps an xrpl.js Batch `Flags` field to the Ripple Custody `executionMode`.
 * Accepts a numeric bitmask or a pre-decoded object form (`{ tfAllOrNothing: true }`).
 * Throws if no execution-mode flag is set or multiple are set.
 */
const batchFlagsToExecutionMode = (flags: number | object | undefined): Core_BatchExecutionMode => {
  if (flags === undefined) {
    throw new CustodyError({
      reason: "Batch.Flags is required to determine executionMode",
    })
  }

  const matches: Core_BatchExecutionMode[] = []
  if (typeof flags === "object") {
    const f = flags as Record<string, boolean>
    if (f.tfAllOrNothing) matches.push("AllOrNothing")
    if (f.tfOnlyOne) matches.push("OnlyOne")
    if (f.tfUntilFailure) matches.push("UntilFailure")
    if (f.tfIndependent) matches.push("Independent")
  } else {
    if (flags & BatchFlags.tfAllOrNothing) matches.push("AllOrNothing")
    if (flags & BatchFlags.tfOnlyOne) matches.push("OnlyOne")
    if (flags & BatchFlags.tfUntilFailure) matches.push("UntilFailure")
    if (flags & BatchFlags.tfIndependent) matches.push("Independent")
  }

  if (matches.length === 0) {
    throw new CustodyError({
      reason: `Batch.Flags does not set a recognized execution-mode flag (${String(flags)})`,
    })
  }
  if (matches.length > 1) {
    throw new CustodyError({
      reason: `Batch.Flags sets multiple execution-mode flags: ${matches.join(", ")}`,
    })
  }
  return matches[0]!
}

/**
 * Converts an autofilled xrpl.js Batch into a `BatchPayloadInput` for
 * `dryRunBatch` / `proposeBatch`.
 *
 * - `Flags` is required and must set exactly one execution-mode flag
 *   (`tfAllOrNothing` / `tfOnlyOne` / `tfUntilFailure` / `tfIndependent`)
 * - When `Sequence` is present on the outer Batch, it is mapped to
 *   `{ type: "AccountSequence", value: Sequence }`; otherwise `sequencing`
 *   is omitted so the service default `{ type: "PlatformManaged" }` applies
 * - `LastLedgerSequence` is passed through when present
 * - `BatchSigners` on the input is ignored — collect signatures separately
 *   and pass them to `proposeBatch`
 */
export const batchToCustodyBatchPayload = (batch: Batch): BatchPayloadInput => {
  return {
    Account: batch.Account,
    executionMode: batchFlagsToExecutionMode(batch.Flags),
    entries: batchToCustodyInnerTransactions(batch),
    ...(!isUndefined(batch.Sequence) && {
      sequencing: { type: "AccountSequence" as const, value: batch.Sequence },
    }),
    ...(!isUndefined(batch.LastLedgerSequence) && {
      lastLedgerSequence: batch.LastLedgerSequence,
    }),
  }
}

/**
 * Converts an xrpl.js Batch transaction to the inner transactions array
 * required by the Ripple Custody API.
 *
 * Each inner transaction is emitted as a `SubmitterOperation` when its
 * `Account` matches the outer `Batch.Account` (the submitter), and as a
 * `ParticipantOperation` otherwise.
 */
export const batchToCustodyInnerTransactions = (
  batch: Pick<Batch, "Account" | "RawTransactions">,
): CustodyInnerTransaction[] => {
  return batch.RawTransactions.map(({ RawTransaction: tx }): CustodyInnerTransaction => {
    const sequencing: Core_ParticipantSequencing = !isUndefined(tx.TicketSequence)
      ? { type: "Ticket", value: tx.TicketSequence }
      : { type: "AccountSequence", value: tx.Sequence ?? 0 }
    if (tx.Account === batch.Account) {
      return {
        type: "SubmitterOperation",
        sequencing,
        operation: txToOperation(tx),
      }
    }
    return {
      type: "ParticipantOperation",
      participant: { type: "Address", address: tx.Account },
      sequencing,
      operation: txToOperation(tx),
    }
  })
}
