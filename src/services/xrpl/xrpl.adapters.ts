import {
  AccountSetAsfFlags,
  type Batch,
  BatchFlags,
  type BatchFlagsInterface,
  type BatchSigner,
  type IssuedCurrencyAmount,
  isValidAddress,
  type Memo,
  MPTokenAuthorizeFlags,
  type MPTokenAuthorizeFlagsInterface,
  MPTokenIssuanceCreateFlags,
  type MPTokenIssuanceCreateFlagsInterface,
  MPTokenIssuanceSetFlags,
  type MPTokenIssuanceSetFlagsInterface,
  OfferCreateFlags,
  type OfferCreateFlagsInterface,
  PaymentFlags,
  type PaymentFlagsInterface,
  SponsorFlags,
  TrustSetFlags,
  type TrustSetFlagsInterface,
} from "xrpl"
import { isObject, isString, isUndefined } from "../../helpers/index.js"
import { CustodyError } from "../../models/index.js"
import type {
  BatchPayloadInput,
  BatchToCustodyOptions,
  ConfidentialSendEntryFields,
  Core_ApiParametersComputeCryptographicFields,
  Core_BatchExecutionMode,
  Core_CmptCryptographicFields,
  Core_ParticipantSequencing,
  Core_Xrpl_PaymentFlag,
  Core_Xrpl_SponsorFlag,
  Core_XrplMemo,
  Core_XrplSponsorshipParams,
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
  flags?: number | OfferCreateFlagsInterface,
): ("tfImmediateOrCancel" | "tfFillOrKill" | "tfSell")[] => {
  if (!flags) return []
  if (isObject<OfferCreateFlagsInterface>(flags)) {
    return (["tfImmediateOrCancel", "tfFillOrKill", "tfSell"] as const).filter((k) => flags[k])
  }
  const result: ("tfImmediateOrCancel" | "tfFillOrKill" | "tfSell")[] = []
  if (flags & OfferCreateFlags.tfImmediateOrCancel) result.push("tfImmediateOrCancel")
  if (flags & OfferCreateFlags.tfFillOrKill) result.push("tfFillOrKill")
  if (flags & OfferCreateFlags.tfSell) result.push("tfSell")
  return result
}

const trustSetFlagsToStrings = (
  flags?: number | TrustSetFlagsInterface,
): ("tfSetFreeze" | "tfClearFreeze" | "tfSetfAuth")[] => {
  if (!flags) return []
  if (isObject<TrustSetFlagsInterface>(flags)) {
    return (["tfSetfAuth", "tfSetFreeze", "tfClearFreeze"] as const).filter((k) => flags[k])
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

const mpTokenAuthorizeFlagsToStrings = (
  flags?: number | MPTokenAuthorizeFlagsInterface,
): "tfMPTUnauthorize"[] => {
  if (!flags) return []
  if (isObject<MPTokenAuthorizeFlagsInterface>(flags)) {
    return (["tfMPTUnauthorize"] as const).filter((k) => flags[k])
  }
  const result: "tfMPTUnauthorize"[] = []
  if (flags & MPTokenAuthorizeFlags.tfMPTUnauthorize) result.push("tfMPTUnauthorize")
  return result
}

type MPTokenIssuanceCreateFlag = CustodyMpTokenIssuanceCreate["flags"][number]

const mpTokenIssuanceCreateFlagsToStrings = (
  flags?: number | MPTokenIssuanceCreateFlagsInterface,
): MPTokenIssuanceCreateFlag[] => {
  if (!flags) return []
  if (isObject<MPTokenIssuanceCreateFlagsInterface>(flags)) {
    return (
      [
        "tfMPTCanLock",
        "tfMPTRequireAuth",
        "tfMPTCanEscrow",
        "tfMPTCanTrade",
        "tfMPTCanTransfer",
        "tfMPTCanClawback",
      ] as const
    ).filter((k) => flags[k])
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
  flags?: number | MPTokenIssuanceSetFlagsInterface,
): ("tfMPTLock" | "tfMPTUnlock")[] => {
  if (!flags) return []
  if (isObject<MPTokenIssuanceSetFlagsInterface>(flags)) {
    return (["tfMPTLock", "tfMPTUnlock"] as const).filter((k) => flags[k])
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
  flags?: number | MPTokenIssuanceSetFlagsInterface,
): MPTokenIssuanceMutableFlag[] => {
  if (!flags) return []
  if (isObject<MPTokenIssuanceSetFlagsInterface>(flags)) {
    return flags.tfMPTSetCanHoldConfidentialBalance ? ["MPTSetCanConfidentialAmount"] : []
  }
  return flags & MPTokenIssuanceSetFlags.tfMPTSetCanHoldConfidentialBalance
    ? ["MPTSetCanConfidentialAmount"]
    : []
}

// Confidential MPT ciphertexts, commitments and proofs are hex-encoded Blob
// fields on the XRPL wire (and so on the xrpl.js models), but the Custody API
// types every member of `Core_CmptCryptographicFields` as `format: base64`.
const paymentFlagsToStrings = (flags?: number | PaymentFlagsInterface): Core_Xrpl_PaymentFlag[] => {
  if (!flags) return []
  if (isObject<PaymentFlagsInterface>(flags)) {
    return (["tfSponsorCreatedAccount"] as const).filter((k) => flags[k])
  }
  const result: Core_Xrpl_PaymentFlag[] = []
  if (flags & PaymentFlags.tfSponsorCreatedAccount) result.push("tfSponsorCreatedAccount")
  return result
}

const sponsorFlagsToStrings = (
  flags: number | Partial<Record<Core_Xrpl_SponsorFlag, boolean>>,
): Core_Xrpl_SponsorFlag[] => {
  if (isObject<Partial<Record<Core_Xrpl_SponsorFlag, boolean>>>(flags)) {
    return (["spfSponsorFee", "spfSponsorReserve"] as const).filter((k) => flags[k])
  }
  const result: Core_Xrpl_SponsorFlag[] = []
  if (flags & SponsorFlags.spfSponsorFee) result.push("spfSponsorFee")
  if (flags & SponsorFlags.spfSponsorReserve) result.push("spfSponsorReserve")
  return result
}

/**
 * Maps a transaction's XLS-68 `Sponsor` / `SponsorFlags` to a Custody
 * `sponsorship` (entry-level for an inner transaction, order-level for the
 * outer Batch), or `undefined` when it has no sponsor. `SponsorSignature` has
 * no Custody counterpart and is ignored. `label` names the transaction in
 * error messages.
 *
 * @throws {CustodyError} If `SponsorFlags` is set without `Sponsor`, or
 *   `Sponsor` is set without at least one known sponsor flag
 */
const txToSponsorship = (
  tx: Pick<RawTx, "Account" | "Sponsor" | "SponsorFlags">,
  label = "Inner transaction",
): Core_XrplSponsorshipParams | undefined => {
  if (isUndefined(tx.Sponsor)) {
    if (!isUndefined(tx.SponsorFlags)) {
      throw new CustodyError({
        reason: `${label} from ${tx.Account} has SponsorFlags but no Sponsor`,
      })
    }
    return undefined
  }

  const flags = sponsorFlagsToStrings(tx.SponsorFlags ?? 0)
  if (flags.length === 0) {
    throw new CustodyError({
      reason:
        `${label} from ${tx.Account} has Sponsor ${tx.Sponsor} but its SponsorFlags ` +
        "set neither spfSponsorFee nor spfSponsorReserve",
    })
  }

  return { sponsor: { type: "Address", address: tx.Sponsor }, flags }
}

const hexToBase64 = (hex: string) => Buffer.from(hex, "hex").toString("base64")

/**
 * Treats `null` as absent alongside `undefined`. The parameters-compute
 * response sends an explicit `null` — not an omitted key — for material it has
 * no value for (`auditorEncryptedAmount` when no auditor key is registered),
 * where the generated types only ever declare the field optional. An
 * `undefined`-only check lets that `null` through to `hexToBase64`, which turns
 * it into an empty string rather than leaving the field off.
 *
 * Exported for `XrplService` only — not part of the SDK's public surface.
 */
export const isPresent = <T>(value: T | null | undefined): value is T =>
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

/**
 * Narrows the cryptographic material a parameters computation returned to its
 * `Send` variant — the one a `ConfidentialMPTSend` is built from.
 *
 * The response carries no `type` discriminator, unlike the operation's union,
 * so the variant has to be inferred from the fields present: only `Send` has a
 * `senderEncryptedAmount`. Exported because reading `cryptographicFields`
 * without narrowing them is otherwise a hand-written type guard in every
 * consumer, and the fields are all hex strings, so a wrong guard fails at the
 * ledger rather than at the call site.
 *
 * `xrpl.buildConfidentialSend` applies this internally — reach for it only when
 * building a confidential send by hand.
 *
 * @param fields - `cryptographicFields` from a completed parameters computation
 * @returns Whether the material is the `Send` variant
 */
export const isSendCryptographicFields = (
  fields: Core_ApiParametersComputeCryptographicFields,
): fields is Extract<
  Core_ApiParametersComputeCryptographicFields,
  { senderEncryptedAmount: string }
> => hasValue(fields, "senderEncryptedAmount")

const txToOperation = (tx: RawTx): CustodyOperation => {
  switch (tx.TransactionType) {
    case "Payment": {
      const amount = tx.Amount
      // Omitted when empty, so a Payment without the flag keeps its signed body.
      const flags = paymentFlagsToStrings(tx.Flags)
      if (isString(amount)) {
        // XRP drops
        return {
          type: "Payment",
          destination: { type: "Address", address: tx.Destination },
          amount,
          ...(tx.DestinationTag !== undefined && { destinationTag: tx.DestinationTag }),
          ...(flags.length > 0 && { flags }),
        }
      }
      const isMPT = "mpt_issuance_id" in amount
      return {
        type: "Payment",
        destination: { type: "Address", address: tx.Destination },
        amount: amount.value,
        ...(tx.DestinationTag !== undefined && { destinationTag: tx.DestinationTag }),
        ...(flags.length > 0 && { flags }),
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
  if (isSendCryptographicFields(fields)) {
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
const batchFlagsToExecutionMode = (
  flags: number | BatchFlagsInterface | undefined,
): Core_BatchExecutionMode => {
  if (isUndefined(flags)) {
    throw new CustodyError({
      reason: "Batch.Flags is required to determine executionMode",
    })
  }

  const matches: Core_BatchExecutionMode[] = []
  if (isObject<BatchFlagsInterface>(flags)) {
    if (flags.tfAllOrNothing) matches.push("AllOrNothing")
    if (flags.tfOnlyOne) matches.push("OnlyOne")
    if (flags.tfUntilFailure) matches.push("UntilFailure")
    if (flags.tfIndependent) matches.push("Independent")
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

// xrpl.js and Custody both carry memo fields hex-encoded, so only the shape changes.
const memoToCustodyMemo = ({ Memo }: Memo): Core_XrplMemo => ({
  ...(!isUndefined(Memo.MemoData) && { memoData: Memo.MemoData }),
  ...(!isUndefined(Memo.MemoType) && { memoType: Memo.MemoType }),
  ...(!isUndefined(Memo.MemoFormat) && { memoFormat: Memo.MemoFormat }),
})

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
 * - `Memos` on the outer Batch are mapped to `memos` when present. Memos on
 *   inner transactions are dropped: the API has no field for them
 * - `SourceTag` on the outer Batch is mapped to `sourceTag` when present.
 *   `Fee` is not mapped to `maximumFee`: autofill sets it, so it is not a cap
 *   the caller chose — set `maximumFee` on the result to cap the fee
 * - `Sponsor` + `SponsorFlags` on the outer Batch are mapped to order-level
 *   `sponsorship` when present. Flags are passed through as given: under
 *   XLS-68 only `spfSponsorFee` is valid on the outer Batch, and the ledger
 *   rejects `spfSponsorReserve` there (`temINVALID_FLAG`)
 * - `BatchSigners` on the input is ignored — collect signatures separately
 *   and pass them to `proposeBatch`
 *
 * `options.confidentialSends` supplies the three `ConfidentialMPTSend` entry
 * fields the XRPL wire format has no room for — see
 * {@link batchToCustodyInnerTransactions}.
 *
 * @throws {CustodyError} If the outer Batch has `SponsorFlags` without
 * `Sponsor`, or `Sponsor` without a known sponsor flag; or for any reason
 * {@link batchToCustodyInnerTransactions} throws
 */
export const batchToCustodyBatchPayload = (
  batch: Batch,
  options?: BatchToCustodyOptions,
): BatchPayloadInput => {
  const sponsorship = txToSponsorship(batch, "Outer Batch")
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
    ...(!isUndefined(batch.Memos) && { memos: batch.Memos.map(memoToCustodyMemo) }),
    ...(!isUndefined(batch.SourceTag) && { sourceTag: batch.SourceTag }),
    ...(!isUndefined(sponsorship) && { sponsorship }),
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
 * An inner transaction's XLS-68 `Sponsor` / `SponsorFlags` become the entry's
 * `sponsorship`. `SponsorSignature` has no Custody counterpart and is ignored.
 * A Payment's `tfSponsorCreatedAccount` flag becomes `flags` on its operation.
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
 * `ConfidentialMPTSend`; or if an inner transaction has `SponsorFlags` without
 * `Sponsor`, or `Sponsor` without a known sponsor flag
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
    const sponsorship = txToSponsorship(tx)

    if (tx.Account === batch.Account) {
      return {
        type: "SubmitterOperation",
        sequencing,
        operation,
        ...(!isUndefined(sponsorship) && { sponsorship }),
      }
    }
    return {
      type: "ParticipantOperation",
      participant: { type: "Address", address: tx.Account },
      sequencing,
      operation,
      ...(!isUndefined(sponsorship) && { sponsorship }),
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
