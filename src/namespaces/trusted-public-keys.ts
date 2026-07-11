import { URLs } from "../constants/urls.js"
import type {
  Core_TrustedTrustedPublicKeysCollection,
  GetTrustedPublicKeysQueryParams,
} from "../services/trusted-public-keys/trusted-public-keys.types.js"
import type { TypedTransport } from "../transport/index.js"

export function createTrustedPublicKeys(t: TypedTransport) {
  return {
    listTrustedCollection: (
      queryParams?: GetTrustedPublicKeysQueryParams,
    ): Promise<Core_TrustedTrustedPublicKeysCollection> =>
      t.get(URLs.trustedPublicKeysCollection, undefined, queryParams),

    listApi: (
      queryParams?: GetTrustedPublicKeysQueryParams,
    ): Promise<Core_TrustedTrustedPublicKeysCollection> =>
      t.get(URLs.trustedPublicKeysApi, undefined, queryParams),

    listMessages: (
      queryParams?: GetTrustedPublicKeysQueryParams,
    ): Promise<Core_TrustedTrustedPublicKeysCollection> =>
      t.get(URLs.trustedPublicKeysMessages, undefined, queryParams),
  } as const
}
