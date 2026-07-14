import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_TrustedTrustedPublicKeysCollection,
  GetTrustedPublicKeysQueryParams,
} from "./trusted-public-keys.types.js"

export function createTrustedPublicKeys(t: Transport) {
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
