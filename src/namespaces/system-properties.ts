import { URLs } from "../constants/urls.js"
import type {
  Core_TrustedSystemPropertiesCollection,
  GetSystemPropertiesQueryParams,
} from "../services/system-properties/system-properties.types.js"
import type { TypedTransport } from "../transport/index.js"

export function createSystemProperties(t: TypedTransport) {
  return {
    list: (
      queryParams?: GetSystemPropertiesQueryParams,
    ): Promise<Core_TrustedSystemPropertiesCollection> =>
      t.get(URLs.properties, undefined, queryParams),
  } as const
}
