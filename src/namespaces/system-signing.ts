import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type { Core_SystemSigningInfo } from "./system-signing.types.js"

/** System-signing namespace (`GET /v1/system-signing/info`). */
export function createSystemSigning(t: Transport) {
  return {
    get: (): Promise<Core_SystemSigningInfo> => t.get(URLs.systemSigningInfo),
  } as const
}
