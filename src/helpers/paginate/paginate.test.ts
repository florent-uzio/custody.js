import { describe, expect, it, vi } from "vitest"
import { CustodyError } from "../../models/custody-error.js"
import type { CursorPage } from "./paginate.js"
import { paginate } from "./paginate.js"

// The `CursorPage` compile-time canary lives in `paginate.ts`, not here:
// `tsconfig.json` excludes `**/*.test.ts`, so type-level assertions in this file
// would never be checked by `npm run build` / `typecheck` / `ci`.

/**
 * Drains an async iterable into an array. Stands in for `Array.fromAsync`, which
 * TypeScript places in `lib: esnext` and so is unavailable under this package's
 * `es2024` target.
 */
async function drain<TItem>(items: AsyncIterable<TItem>): Promise<TItem[]> {
  const collected: TItem[] = []
  for await (const item of items) collected.push(item)
  return collected
}

/**
 * Builds a `fetchPage` over fixed pages, recording the cursor each call
 * received so laziness and early-exit can be asserted on request count.
 */
function pagesOf<TItem>(pages: CursorPage<TItem>[]) {
  const cursors: (string | undefined)[] = []
  const fetchPage = vi.fn(async (startingAfter: string | undefined) => {
    cursors.push(startingAfter)
    const index = startingAfter === undefined ? 0 : Number(startingAfter)
    const page = pages[index]
    if (!page) throw new Error(`test fixture has no page at index ${index}`)
    return page
  })
  return { fetchPage, cursors }
}

/** Page `n` of `total`, carrying `items`, cursored by index. */
function page<TItem>(items: TItem[], next?: string | null): CursorPage<TItem> {
  return { items, nextStartingAfter: next }
}

describe("paginate", () => {
  it("yields every item across pages, in order", async () => {
    const { fetchPage } = pagesOf([page(["a", "b"], "1"), page(["c", "d"], "2"), page(["e"])])

    const seen: string[] = []
    for await (const item of paginate(fetchPage)) {
      seen.push(item)
    }

    expect(seen).toEqual(["a", "b", "c", "d", "e"])
    expect(fetchPage).toHaveBeenCalledTimes(3)
  })

  it("passes undefined as the first cursor, then each nextStartingAfter", async () => {
    const { fetchPage, cursors } = pagesOf([page(["a"], "1"), page(["b"], "2"), page(["c"])])

    await drain(paginate(fetchPage))

    expect(cursors).toEqual([undefined, "1", "2"])
  })

  it("stops after a single page that carries no cursor", async () => {
    const { fetchPage } = pagesOf([page(["only"])])

    expect(await drain(paginate(fetchPage))).toEqual(["only"])
    expect(fetchPage).toHaveBeenCalledTimes(1)
  })

  it("yields nothing for an empty collection", async () => {
    const { fetchPage } = pagesOf([page([])])

    expect(await drain(paginate(fetchPage))).toEqual([])
    expect(fetchPage).toHaveBeenCalledTimes(1)
  })

  it("follows the cursor on an empty page rather than treating it as the end", async () => {
    // The cursor is authoritative: a page may legitimately come back empty
    // after server-side filtering while further pages still hold matches.
    const { fetchPage } = pagesOf([page(["a"], "1"), page([], "2"), page(["c"])])

    expect(await drain(paginate(fetchPage))).toEqual(["a", "c"])
    expect(fetchPage).toHaveBeenCalledTimes(3)
  })

  it("treats a null cursor as the end (the VirtualAccounting_* shape)", async () => {
    const { fetchPage } = pagesOf([page(["a"], null)])

    expect(await drain(paginate(fetchPage))).toEqual(["a"])
    expect(fetchPage).toHaveBeenCalledTimes(1)
  })

  it("treats an empty-string cursor as the end", async () => {
    const { fetchPage } = pagesOf([page(["a"], "")])

    expect(await drain(paginate(fetchPage))).toEqual(["a"])
    expect(fetchPage).toHaveBeenCalledTimes(1)
  })

  it("throws a CustodyError when the cursor does not advance", async () => {
    // Page 1 hands back the very cursor that produced it — following it would
    // repeat the same page forever.
    const fetchPage = vi.fn(async (startingAfter: string | undefined) =>
      startingAfter === undefined ? page(["a"], "stuck") : page(["b"], "stuck"),
    )

    const drained = drain(paginate(fetchPage))

    await expect(drained).rejects.toThrow(CustodyError)
    await expect(drained).rejects.toThrow("Pagination stalled")
    expect(fetchPage).toHaveBeenCalledTimes(2)
  })

  it("does not fetch the next page until the current one is exhausted", async () => {
    const { fetchPage } = pagesOf([page(["a", "b"], "1"), page(["c"])])

    const iterator = paginate(fetchPage)

    await iterator.next()
    expect(fetchPage).toHaveBeenCalledTimes(1)

    // still inside page 1
    await iterator.next()
    expect(fetchPage).toHaveBeenCalledTimes(1)

    // page 1 exhausted, so this one crosses the boundary
    await iterator.next()
    expect(fetchPage).toHaveBeenCalledTimes(2)
  })

  it("issues no further requests after an early break", async () => {
    const { fetchPage } = pagesOf([page(["a", "b"], "1"), page(["c"], "2"), page(["d"])])

    for await (const item of paginate(fetchPage)) {
      if (item === "a") break
    }

    expect(fetchPage).toHaveBeenCalledTimes(1)
  })
})
