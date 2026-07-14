import type { components, operations } from "../models/custody-types.js"

// Request types
//
// All three trusted-public-keys endpoints share the same paging query contract,
// so a single alias covers them.

export type GetTrustedPublicKeysQueryParams =
  operations["getTrustedPublicKeysTrustedCollection"]["parameters"]["query"]

// Response types

export type Core_TrustedTrustedPublicKeysCollection =
  components["schemas"]["Core_TrustedTrustedPublicKeysCollection"]
