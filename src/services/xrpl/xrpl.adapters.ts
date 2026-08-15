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
  isValidAddress,
} from "xrpl"
import { isString, isUndefined } from "../../helpers/index.js"
import { CustodyError } from "../../models/index.js"
import type {
  BatchPayloadInput,
  BatchToCustodyOptions,
  ConfidentialSendEntryFields,
  Core_ApiParametersComputeCryptographicFields,
  Core_BatchExecutionMode,
  Core_CmptCryptographicFields,
  Core_ParticipantSequencing,
  CustodyAccountSetFlag,
  CustodyBatchSigner,
  CustodyInnerTransaction,
  CustodyMpTokenIssuanceCreate,
  CustodyMpTokenIssuanceSet,
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

type MPTokenIssuanceMutableFlag = CustodyMpTokenIssuanceSet["mutableFlags"][number]

// The confidential-amount capability sits in different places in the two models:
// xrpl.js carries it as the `tfMPTSetCanHoldConfidentialBalance` bit on `Flags`,
// while the Custody API exposes it as the sole member of `mutableFlags`. It is
// arguably not a mutable flag at all, but until the two converge we read the
// xrpl.js `Flags` bit and emit it on the Custody `mutableFlags` array.
const mpTokenIssuanceSetMutableFlagsToStrings = (
  flags?: number | object,
): MPTokenIssuanceMutableFlag[] => {
  if (!flags) return []
  if (typeof flags === "object") {
    const f = flags as Record<string, boolean>
    return f.tfMPTSetCanHoldConfidentialBalance ? ["MPTSetCanConfidentialAmount"] : []
  }
  return flags & MPTokenIssuanceSetFlags.tfMPTSetCanHoldConfidentialBalance
    ? ["MPTSetCanConfidentialAmount"]
    : []
}

// Confidential MPT ciphertexts, commitments and proofs are hex-encoded Blob
// fields on the XRPL wire (and so on the xrpl.js models), but the Custody API
// types every member of `Core_CmptCryptographicFields` as `format: base64`.
const hexToBase64 = (hex: string) => Buffer.from(hex, "hex").toString("base64")

/**
 * Treats `null` as absent alongside `undefined`. The parameters-compute
 * response sends an explicit `null` — not an omitted key — for material it has
 * no value for (`auditorEncryptedAmount` when no auditor key is registered),
 * where the generated types only ever declare the field optional. An
 * `undefined`-only check lets that `null` through to `hexToBase64`, which turns
 * it into an empty string rather than leaving the field off.
 */
const isPresent = <T>(value: T | null | undefined): value is T =>
  !isUndefined(value) && value !== null

/**
 * Narrows a parameters-compute union member by a discriminating key, requiring
 * the key to carry a value rather than merely exist — a `null` field must not
 * select a variant. `0` counts as present, so a Clawback of zero still
 * discriminates on `amount`.
 */
const hasValue = <K extends string>(
  fields: Core_ApiParametersComputeCryptographicFields,
  key: K,
): fields is Extract<Core_ApiParametersComputeCryptographicFields, Record<K, unknown>> =>
  key in fields && isPresent((fields as Record<string, unknown>)[key])

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
        mutableFlags: mpTokenIssuanceSetMutableFlagsToStrings(tx.Flags),
        ...(tx.Holder !== undefined && {
          holder: { type: "Address" as const, address: tx.Holder },
        }),
        ...(tx.IssuerEncryptionKey !== undefined && {
          issuerEncryptionKey: tx.IssuerEncryptionKey,
        }),
        ...(tx.AuditorEncryptionKey !== undefined && {
          auditorEncryptionKey: tx.AuditorEncryptionKey,
        }),
      }
    // The Convert / ConvertBack / MergeInbox inner operations carry no
    // cryptographic material: the Custody service derives it server-side from
    // the plaintext amount, so only the issuance and the amount cross over.
    case "ConfidentialMPTConvert":
      return {
        type: "ConfidentialMPTConvert",
        tokenIdentifier: { type: "MPTokenIssuanceId" as const, issuanceId: tx.MPTokenIssuanceID },
        amount: tx.MPTAmount,
      }
    case "ConfidentialMPTConvertBack":
      return {
        type: "ConfidentialMPTConvertBack",
        tokenIdentifier: { type: "MPTokenIssuanceId" as const, issuanceId: tx.MPTokenIssuanceID },
        amount: tx.MPTAmount,
      }
    case "ConfidentialMPTMergeInbox":
      return {
        type: "ConfidentialMPTMergeInbox",
        tokenIdentifier: { type: "MPTokenIssuanceId" as const, issuanceId: tx.MPTokenIssuanceID },
      }
    // ConfidentialMPTSend is the one type that carries the full proof bundle.
    // The Custody operation has no plaintext `amount` counterpart on an
    // xrpl.js Send (the value only exists as ciphertext), and `DestinationTag`
    // / `CredentialIDs` have no counterpart at all, so all three are dropped.
    // `amount`, `senderEncryptedBalance` and `senderEncryptedBalanceVersion`
    // are supplied out of band via `BatchToCustodyOptions.confidentialSends`.
    case "ConfidentialMPTSend":
      return {
        type: "ConfidentialMPTSend",
        tokenIdentifier: { type: "MPTokenIssuanceId" as const, issuanceId: tx.MPTokenIssuanceID },
        destination: { type: "Address" as const, address: tx.Destination },
        cryptographicFields: {
          type: "Send" as const,
          senderEncryptedAmount: hexToBase64(tx.SenderEncryptedAmount),
          destinationEncryptedAmount: hexToBase64(tx.DestinationEncryptedAmount),
          issuerEncryptedAmount: hexToBase64(tx.IssuerEncryptedAmount),
          balanceCommitment: hexToBase64(tx.BalanceCommitment),
          amountCommitment: hexToBase64(tx.AmountCommitment),
          zkProof: hexToBase64(tx.ZKProof),
          ...(tx.AuditorEncryptedAmount !== undefined && {
            auditorEncryptedAmount: hexToBase64(tx.AuditorEncryptedAmount),
          }),
        },
      }
    default:
      throw new Error(`Unsupported transaction type: ${tx.TransactionType}`)
  }
}

/**
 * Re-encodes the cryptographic material a parameters computation returns into
 * the form a confidential MPT operation carries.
 *
 * `GET .../parameters-compute/{computeId}` returns every field **hex**-encoded,
 * while `Core_CmptCryptographicFields` on the operation is **base64** — so the
 * compute response cannot be spliced into a `ConfidentialMPTSend` as-is.
 *
 * The response also carries no `type` discriminator, unlike the operation's
 * union, so the variant is inferred from the fields present: a
 * `senderEncryptedAmount` means `Send`, a numeric `amount` means `Clawback`, a
 * `balanceCommitment` alongside `holderEncryptedAmount` means `ConvertBack`,
 * and `holderEncryptedAmount` alone means `Convert`.
 *
 * One field deliberately has no counterpart here: a Batch entry's **top-level**
 * `senderEncryptedBalance` stays hex, so pass `fields.senderEncryptedBalance`
 * straight through rather than reading it off the result of this call.
 *
 * @param fields - `cryptographicFields` from a completed parameters computation
 * @returns The same material, base64-encoded and tagged with its operation type
 * @throws {CustodyError} If the shape matches none of the four known variants
 */
export const parametersComputeToCryptographicFields = (
  fields: Core_ApiParametersComputeCryptographicFields,
): Core_CmptCryptographicFields => {
  if (hasValue(fields, "senderEncryptedAmount")) {
    return {
      type: "Send",
      senderEncryptedAmount: hexToBase64(fields.senderEncryptedAmount),
      destinationEncryptedAmount: hexToBase64(fields.destinationEncryptedAmount),
      issuerEncryptedAmount: hexToBase64(fields.issuerEncryptedAmount),
      balanceCommitment: hexToBase64(fields.balanceCommitment),
      amountCommitment: hexToBase64(fields.amountCommitment),
      zkProof: hexToBase64(fields.zkProof),
      ...(isPresent(fields.senderEncryptedBalance) && {
        senderEncryptedBalance: hexToBase64(fields.senderEncryptedBalance),
      }),
      ...(isPresent(fields.senderEncryptedBalanceVersion) && {
        senderEncryptedBalanceVersion: fields.senderEncryptedBalanceVersion,
      }),
      ...(isPresent(fields.auditorEncryptedAmount) && {
        auditorEncryptedAmount: hexToBase64(fields.auditorEncryptedAmount),
      }),
    }
  }

  if (hasValue(fields, "amount")) {
    return {
      type: "Clawback",
      zkProof: hexToBase64(fields.zkProof),
      amount: fields.amount,
    }
  }

  if (hasValue(fields, "holderEncryptedAmount")) {
    // Only ConvertBack commits to the resulting balance; Convert has no such
    // field, and its zkProof is optional where ConvertBack's is required.
    if (hasValue(fields, "balanceCommitment")) {
      return {
        type: "ConvertBack",
        holderEncryptedAmount: hexToBase64(fields.holderEncryptedAmount),
        issuerEncryptedAmount: hexToBase64(fields.issuerEncryptedAmount),
        blindingFactor: hexToBase64(fields.blindingFactor),
        balanceCommitment: hexToBase64(fields.balanceCommitment),
        zkProof: hexToBase64(fields.zkProof),
        ...(isPresent(fields.auditorEncryptedAmount) && {
          auditorEncryptedAmount: hexToBase64(fields.auditorEncryptedAmount),
        }),
      }
    }

    return {
      type: "Convert",
      holderEncryptedAmount: hexToBase64(fields.holderEncryptedAmount),
      issuerEncryptedAmount: hexToBase64(fields.issuerEncryptedAmount),
      blindingFactor: hexToBase64(fields.blindingFactor),
      ...(isPresent(fields.zkProof) && { zkProof: hexToBase64(fields.zkProof) }),
      ...(isPresent(fields.auditorEncryptedAmount) && {
        auditorEncryptedAmount: hexToBase64(fields.auditorEncryptedAmount),
      }),
    }
  }

  throw new CustodyError({
    reason:
      "Unrecognized parameters-compute cryptographicFields shape: " +
      `[${Object.keys(fields).join(", ")}]`,
  })
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

// Splices the custody-only entry fields onto a ConfidentialMPTSend operation.
// Fields left undefined are omitted rather than emitted as `undefined`.
const withConfidentialSendFields = (
  operation: CustodyOperation,
  address: string,
  fields: ConfidentialSendEntryFields,
): CustodyOperation => {
  if (operation.type !== "ConfidentialMPTSend") {
    throw new CustodyError({
      reason:
        `confidentialSends["${address}"] targets a ${operation.type} inner transaction; ` +
        "only ConfidentialMPTSend entries carry these fields",
    })
  }
  return {
    ...operation,
    ...(!isUndefined(fields.amount) && { amount: fields.amount }),
    ...(!isUndefined(fields.senderEncryptedBalance) && {
      senderEncryptedBalance: fields.senderEncryptedBalance,
    }),
    ...(!isUndefined(fields.senderEncryptedBalanceVersion) && {
      senderEncryptedBalanceVersion: fields.senderEncryptedBalanceVersion,
    }),
  }
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
 *
 * `options.confidentialSends` supplies the three `ConfidentialMPTSend` entry
 * fields the XRPL wire format has no room for — see
 * {@link batchToCustodyInnerTransactions}.
 */
export const batchToCustodyBatchPayload = (
  batch: Batch,
  options?: BatchToCustodyOptions,
): BatchPayloadInput => {
  return {
    Account: batch.Account,
    executionMode: batchFlagsToExecutionMode(batch.Flags),
    entries: batchToCustodyInnerTransactions(batch, options),
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
 *
 * `options.confidentialSends` exists because a `ConfidentialMPTSend` entry
 * needs three fields an xrpl.js transaction cannot carry: the plaintext
 * `amount`, and the sender's `senderEncryptedBalance` /
 * `senderEncryptedBalanceVersion`. The ledger needs none of them — the amount
 * only ever exists as ciphertext and the balance is read from ledger state at
 * apply time — but Harmonize needs all three to dry-run the Batch and
 * re-derive the proofs, so they have to be passed in alongside the Batch.
 *
 * `senderEncryptedBalance` is passed through as **hex**, unlike the
 * `cryptographicFields` on the operation, which are base64 (see
 * {@link parametersComputeToCryptographicFields}).
 *
 * @throws {CustodyError} If a `confidentialSends` key is not a valid XRPL
 * address, matches no inner transaction, or matches one that is not a
 * `ConfidentialMPTSend`
 */
export const batchToCustodyInnerTransactions = (
  batch: Pick<Batch, "Account" | "RawTransactions">,
  options?: BatchToCustodyOptions,
): CustodyInnerTransaction[] => {
  const { confidentialSends } = options ?? {}
  const addresses = Object.keys(confidentialSends ?? {})

  // Checked before the conversion runs: a malformed key can never match an
  // inner transaction, so it would otherwise surface as the far less specific
  // "no matching inner transaction" below.
  const invalidAddresses = addresses.filter((address) => !isValidAddress(address))
  if (invalidAddresses.length > 0) {
    throw new CustodyError({
      reason:
        "confidentialSends contains keys that are not valid XRPL addresses: " +
        `${invalidAddresses.join(", ")}`,
    })
  }

  const unmatchedAddresses = new Set(addresses)

  const entries = batch.RawTransactions.map(({ RawTransaction: tx }): CustodyInnerTransaction => {
    const sequencing: Core_ParticipantSequencing = !isUndefined(tx.TicketSequence)
      ? { type: "Ticket", value: tx.TicketSequence }
      : { type: "AccountSequence", value: tx.Sequence ?? 0 }

    const extras = confidentialSends?.[tx.Account]
    unmatchedAddresses.delete(tx.Account)
    const operation = isUndefined(extras)
      ? txToOperation(tx)
      : withConfidentialSendFields(txToOperation(tx), tx.Account, extras)

    if (tx.Account === batch.Account) {
      return {
        type: "SubmitterOperation",
        sequencing,
        operation,
      }
    }
    return {
      type: "ParticipantOperation",
      participant: { type: "Address", address: tx.Account },
      sequencing,
      operation,
    }
  })

  if (unmatchedAddresses.size > 0) {
    throw new CustodyError({
      reason:
        "confidentialSends contains addresses with no matching inner transaction: " +
        `${[...unmatchedAddresses].join(", ")}`,
    })
  }

  return entries
}
