import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_TrustedSystemPropertiesCollection,
  GetSystemPropertiesQueryParams,
} from "./system-properties.types.js"

export function createSystemProperties(t: Transport) {
  return {
    list: (
      queryParams?: GetSystemPropertiesQueryParams,
    ): Promise<Core_TrustedSystemPropertiesCollection> =>
      t.get(URLs.properties, undefined, queryParams),
  } as const
}
