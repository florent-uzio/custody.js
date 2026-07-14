import { beforeEach, describe, expect, it, vi } from "vitest"
import { createFakeTransport } from "../../testing/fake-transport.js"
import { createGenesis } from "../genesis.js"
import { createIntents } from "../intents.js"
import { createLedgers } from "../ledgers.js"
import { createTransactions } from "../transactions.js"
import { createUserInvitations } from "../user-invitations.js"
import { createVaults } from "../vaults.js"

const mockTransport = createFakeTransport()

describe("non-intent POST methods pass sign: false", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("intents.dryRun", async () => {
    const intents = createIntents(mockTransport)
    await intents.dryRun({} as any)

    expect(mockTransport.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      undefined,
      expect.objectContaining({ sign: false }),
    )
  })

  it("transactions.dryRun", async () => {
    const transactions = createTransactions(mockTransport)
    await transactions.dryRun({} as any, {} as any)

    expect(mockTransport.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ sign: false }),
    )
  })

  it("genesis.run", async () => {
    const genesis = createGenesis(mockTransport)
    await genesis.run({} as any)

    expect(mockTransport.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      undefined,
      expect.objectContaining({ sign: false }),
    )
  })

  it("ledgers.processEthereumContractCall", async () => {
    const ledgers = createLedgers(mockTransport)
    await ledgers.processEthereumContractCall({} as any, {} as any)

    expect(mockTransport.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ sign: false }),
    )
  })

  it("userInvitations.create", async () => {
    const userInvitations = createUserInvitations(mockTransport)
    await userInvitations.create({} as any, {} as any)

    expect(mockTransport.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ sign: false }),
    )
  })

  it("userInvitations.fill", async () => {
    const userInvitations = createUserInvitations(mockTransport)
    await userInvitations.fill({} as any, {} as any)

    expect(mockTransport.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ sign: false }),
    )
  })

  it("vaults.importPreparedOperations", async () => {
    const vaults = createVaults(mockTransport)
    await vaults.importPreparedOperations({ files: {} } as any)

    expect(mockTransport.post).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      undefined,
      expect.objectContaining({ sign: false }),
    )
  })

  it("intents.propose stays signed (inverse case)", async () => {
    const intents = createIntents(mockTransport)
    await intents.propose({} as any)

    expect(mockTransport.post).toHaveBeenCalledWith(expect.anything(), expect.anything())
  })
})
