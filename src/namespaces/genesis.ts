import { URLs } from "../constants/urls.js"
import type { TypedTransport } from "../transport/index.js"
import type { RunGenesisBody } from "./genesis.types.js"

export function createGenesis(t: TypedTransport) {
  return {
    run: (body: RunGenesisBody): Promise<void> =>
      t.post(URLs.genesis, body, undefined, { sign: false }),
  } as const
}
