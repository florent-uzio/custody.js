import { generateKeyPairSync } from "node:crypto"
import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

import { RippleCustody } from "./ripple-custody.js"

/**
 * Keeps `docs/namespaces.md` — the full public surface — in step with the
 * client: every namespace method has to be listed in its namespace's row, and
 * every listed method has to exist.
 */

const { privateKey, publicKey } = generateKeyPairSync("ed25519", {
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
})

const client = new RippleCustody({
  apiUrl: "https://api.example.test",
  authUrl: "https://auth.example.test",
  privateKey,
  publicKey,
})

const isNamespace = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype

/**
 * Every namespace on the client, by path (`transactions`, `omnibus.tenants`),
 * with its method names. Namespaces are the plain objects the factories
 * return; the client's private services are class instances, so they are
 * skipped. A namespace holding only sub-namespaces (`compliance`) has no row.
 */
function clientNamespaces(): Map<string, string[]> {
  const found = new Map<string, string[]>()

  const walk = (path: string, namespace: Record<string, unknown>) => {
    const methods = Object.keys(namespace).filter((key) => typeof namespace[key] === "function")
    if (methods.length > 0) found.set(path, methods)

    for (const [key, value] of Object.entries(namespace)) {
      if (isNamespace(value)) walk(`${path}.${key}`, value)
    }
  }

  for (const [key, value] of Object.entries(client)) {
    if (isNamespace(value)) walk(key, value)
  }

  return found
}

/** The `| \`client.<path>\` | \`a\`, \`b\` | … |` rows of the doc, by path. */
function documentedNamespaces(): Map<string, string[]> {
  const doc = readFileSync(new URL("../docs/namespaces.md", import.meta.url), "utf8")
  const rows = new Map<string, string[]>()

  for (const [, path, methods] of doc.matchAll(/^\| `client\.([\w.]+)`\s*\|([^|]*)\|/gm)) {
    rows.set(
      path as string,
      [...(methods as string).matchAll(/`(\w+)`/g)].map(([, name]) => name as string),
    )
  }

  return rows
}

describe("docs/namespaces.md", () => {
  const actual = clientNamespaces()
  const documented = documentedNamespaces()

  it("has a row for every namespace on the client", () => {
    const missing = [...actual.keys()].filter((path) => !documented.has(path))
    expect(missing, "add a `client.<path>` row to docs/namespaces.md").toEqual([])
  })

  it.each([...actual.entries()])("lists every method of client.%s", (path, methods) => {
    const listed = new Set(documented.get(path) ?? [])
    const undocumented = methods.filter((method) => !listed.has(method))
    expect(undocumented, `add to the client.${path} row of docs/namespaces.md`).toEqual([])
  })

  it.each([...documented.entries()])("lists only methods client.%s has", (path, listed) => {
    const methods = new Set(actual.get(path) ?? [])
    const stale = listed.filter((method) => !methods.has(method))
    expect(stale, `remove from the client.${path} row of docs/namespaces.md`).toEqual([])
  })
})
