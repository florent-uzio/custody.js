import { beforeEach, describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/index.js"
import { createFakeTransport } from "../../testing/fake-transport.js"
import { createCbInDecryption } from "../internal/cb-in-decryption.js"
import type { InitiateCbInDecryptionBody } from "../internal/cb-in-decryption.types.js"

vi.mock("../../helpers/index.js", async () => {
  const actual = await vi.importActual("../../helpers/index.js")
  return {
    ...actual,
    sleep: vi.fn(() => Promise.resolve()),
  }
})

const mockTransport = createFakeTransport()

const CB_IN_URL = "/internal/v1/cmpt-cb-in"
const CB_IN_STATUS_URL = "/internal/v1/cmpt-cb-in/{requestId}"

const body: InitiateCbInDecryptionBody = {
  accountId: "a-1",
  domainId: "d-1",
  ledgerId: "xrpl",
  issuanceId: "mpt-1",
}

describe("internal.cbInDecryption.initiate / getStatus", () => {
  let cbInDecryption: ReturnType<typeof createCbInDecryption>

  beforeEach(() => {
    vi.clearAllMocks()
    cbInDecryption = createCbInDecryption(mockTransport)
  })

  it("should POST unsigned against the internal surface", async () => {
    mockTransport.post.mockResolvedValue({ id: "r-1", status: "Pending" })

    const result = await cbInDecryption.initiate(body)

    expect(mockTransport.post).toHaveBeenCalledWith(CB_IN_URL, body, undefined, {
      sign: false,
      surface: "internal",
    })
    expect(result).toEqual({ id: "r-1", status: "Pending" })
  })

  it("should GET the status against the internal surface", async () => {
    mockTransport.get.mockResolvedValue({ id: "r-1", status: "Completed", decryptedAmount: "100" })

    const result = await cbInDecryption.getStatus({ requestId: "r-1" })

    expect(mockTransport.get).toHaveBeenCalledWith(
      CB_IN_STATUS_URL,
      { requestId: "r-1" },
      undefined,
      { surface: "internal" },
    )
    expect(result.decryptedAmount).toBe("100")
  })
})

describe("internal.cbInDecryption.getStatusAndWait", () => {
  const params = { requestId: "r-1" }
  let cbInDecryption: ReturnType<typeof createCbInDecryption>

  beforeEach(() => {
    vi.clearAllMocks()
    cbInDecryption = createCbInDecryption(mockTransport)
  })

  it("should return immediately when the decryption is already Completed", async () => {
    const decryption = { id: "r-1", status: "Completed", decryptedAmount: "100" }
    mockTransport.get.mockResolvedValue(decryption)

    const result = await cbInDecryption.getStatusAndWait(params)

    expect(result).toEqual({
      status: "Completed",
      isTerminal: true,
      isSuccess: true,
      decryption,
    })
  })

  it("should return isSuccess false for Failed status", async () => {
    mockTransport.get.mockResolvedValue({ id: "r-1", status: "Failed", error: "boom" })

    const result = await cbInDecryption.getStatusAndWait(params)

    expect(result.isTerminal).toBe(true)
    expect(result.isSuccess).toBe(false)
    expect(result.decryption.error).toBe("boom")
  })

  it("should poll through Pending and Preparing until terminal", async () => {
    mockTransport.get
      .mockResolvedValueOnce({ id: "r-1", status: "Pending" })
      .mockResolvedValueOnce({ id: "r-1", status: "Preparing" })
      .mockResolvedValueOnce({ id: "r-1", status: "Completed", decryptedAmount: "100" })

    const result = await cbInDecryption.getStatusAndWait(params, { maxRetries: 5 })

    expect(result.isSuccess).toBe(true)
    expect(result.decryption.decryptedAmount).toBe("100")
    expect(mockTransport.get).toHaveBeenCalledTimes(3)
  })

  it("should return a non-terminal result when max retries are exceeded", async () => {
    mockTransport.get.mockResolvedValue({ id: "r-1", status: "Preparing" })

    const result = await cbInDecryption.getStatusAndWait(params, { maxRetries: 2 })

    // 2 attempts in the polling loop, no extra fetch afterwards
    expect(mockTransport.get).toHaveBeenCalledTimes(2)
    expect(result.isTerminal).toBe(false)
    expect(result.isSuccess).toBe(false)
    expect(result.status).toBe("Preparing")
  })

  it("should call onStatusCheck on each attempt", async () => {
    const onStatusCheck = vi.fn()
    mockTransport.get
      .mockResolvedValueOnce({ id: "r-1", status: "Pending" })
      .mockResolvedValueOnce({ id: "r-1", status: "Completed", decryptedAmount: "100" })

    await cbInDecryption.getStatusAndWait(params, { onStatusCheck })

    expect(onStatusCheck).toHaveBeenCalledWith("Pending", 1)
    expect(onStatusCheck).toHaveBeenCalledWith("Completed", 2)
  })

  it("should keep polling through 404s until the decryption materializes", async () => {
    const notFoundError = new CustodyError({ reason: "Not found" }, 404)
    mockTransport.get
      .mockRejectedValueOnce(notFoundError)
      .mockRejectedValueOnce(notFoundError)
      .mockResolvedValueOnce({ id: "r-1", status: "Completed", decryptedAmount: "100" })

    const result = await cbInDecryption.getStatusAndWait(params, { maxRetries: 10 })

    expect(result.isSuccess).toBe(true)
    expect(mockTransport.get).toHaveBeenCalledTimes(3)
  })

  it("should throw 404 when the decryption never materializes", async () => {
    mockTransport.get.mockRejectedValue(new CustodyError({ reason: "Not found" }, 404))

    await expect(cbInDecryption.getStatusAndWait(params, { maxRetries: 2 })).rejects.toMatchObject({
      statusCode: 404,
    })
  })

  it("should keep polling through 400s raised by concurrent decryptions", async () => {
    mockTransport.get
      .mockRejectedValueOnce(new CustodyError({ reason: "Bad request" }, 400))
      .mockResolvedValueOnce({ id: "r-1", status: "Completed", decryptedAmount: "100" })

    const result = await cbInDecryption.getStatusAndWait(params, { maxRetries: 10 })

    expect(result.isSuccess).toBe(true)
    expect(mockTransport.get).toHaveBeenCalledTimes(2)
  })

  it("should rethrow the last transient error with its own status when retries are exhausted", async () => {
    mockTransport.get.mockRejectedValue(new CustodyError({ reason: "Bad request" }, 400))

    await expect(cbInDecryption.getStatusAndWait(params, { maxRetries: 2 })).rejects.toMatchObject({
      statusCode: 400,
      reason: "Bad request",
    })
  })

  it("should throw non-transient errors immediately", async () => {
    mockTransport.get.mockRejectedValue(new CustodyError({ reason: "Server error" }, 500))

    await expect(cbInDecryption.getStatusAndWait(params)).rejects.toThrow("Server error")
    expect(mockTransport.get).toHaveBeenCalledTimes(1)
  })
})

describe("internal.cbInDecryption.initiateAndWait", () => {
  let cbInDecryption: ReturnType<typeof createCbInDecryption>

  beforeEach(() => {
    vi.clearAllMocks()
    cbInDecryption = createCbInDecryption(mockTransport)
  })

  it("should initiate then poll the returned request id until Completed", async () => {
    mockTransport.post.mockResolvedValue({ id: "r-9", status: "Pending" })
    mockTransport.get
      .mockResolvedValueOnce({ id: "r-9", status: "Preparing" })
      .mockResolvedValueOnce({ id: "r-9", status: "Completed", decryptedAmount: "100" })

    const result = await cbInDecryption.initiateAndWait(body)

    expect(mockTransport.post).toHaveBeenCalledWith(CB_IN_URL, body, undefined, {
      sign: false,
      surface: "internal",
    })
    expect(mockTransport.get).toHaveBeenCalledWith(
      CB_IN_STATUS_URL,
      { requestId: "r-9" },
      undefined,
      { surface: "internal" },
    )
    expect(result.isSuccess).toBe(true)
    expect(result.decryption.decryptedAmount).toBe("100")
  })

  it("should surface a Failed decryption without throwing", async () => {
    mockTransport.post.mockResolvedValue({ id: "r-9", status: "Pending" })
    mockTransport.get.mockResolvedValue({ id: "r-9", status: "Failed", error: "boom" })

    const result = await cbInDecryption.initiateAndWait(body)

    expect(result.isTerminal).toBe(true)
    expect(result.isSuccess).toBe(false)
  })

  it("should not poll when initiating fails", async () => {
    mockTransport.post.mockRejectedValue(new CustodyError({ reason: "Account not ready" }, 409))

    await expect(cbInDecryption.initiateAndWait(body)).rejects.toThrow("Account not ready")
    expect(mockTransport.get).not.toHaveBeenCalled()
  })
})
