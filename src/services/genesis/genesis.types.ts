import type { components, operations } from "../../models/custody-types.js"

export type RunGenesisBody =
  operations["runGenesis"]["requestBody"]["content"]["application/json"]

export type Core_GenesisRequest = components["schemas"]["Core_GenesisRequest"]
export type Core_RootDomainSetup = components["schemas"]["Core_RootDomainSetup"]
export type Core_GenesisCryptoSetup = components["schemas"]["Core_GenesisCryptoSetup"]
export type Core_CreateLedgerGenesis = components["schemas"]["Core_CreateLedgerGenesis"]
