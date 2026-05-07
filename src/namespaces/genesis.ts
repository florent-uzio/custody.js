import { URLs } from "../constants/urls.js"
import type { RunGenesisBody } from "../services/genesis/genesis.types.js"
import type { TypedTransport } from "../transport/index.js"

export function createGenesis(t: TypedTransport) {
  return {
    run: (body: RunGenesisBody): Promise<void> => t.post(URLs.genesis, body),
  } as const
}
