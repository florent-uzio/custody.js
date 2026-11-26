import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import ts from "typescript"
import { expect, it } from "vitest"

import * as runtimeExports from "./index.js"

/**
 * The package's public API, one name per line, so a PR that adds or removes
 * an export shows it as a diff of `__snapshots__/public-exports.txt`.
 *
 * `export type *` makes every type in a re-exported `*.types.ts` public, and
 * nothing else in the diff says so. Update the snapshot with `vitest -u` once
 * the change is intended; see "Public by declaration" in CODING_STANDARDS.md.
 *
 * `value` names exist at runtime (`import { x }` works in JS); `type` names
 * exist only for TypeScript.
 */
it("matches the public export snapshot", { timeout: 60_000 }, async () => {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const entry = join(root, "src", "index.ts")

  const { config } = ts.readConfigFile(join(root, "tsconfig.json"), ts.sys.readFile)
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, root)
  const program = ts.createProgram([entry], options)
  const checker = program.getTypeChecker()

  const sourceFile = program.getSourceFile(entry)
  const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile)
  if (!moduleSymbol) throw new Error(`Could not read the exports of ${entry}`)

  const runtime = new Set(Object.keys(runtimeExports))
  const lines = checker
    .getExportsOfModule(moduleSymbol)
    .map(({ name }) => `${runtime.has(name) ? "value" : "type "} ${name}`)
    .sort((a, b) => a.slice(6).localeCompare(b.slice(6)))

  await expect(`${lines.join("\n")}\n`).toMatchFileSnapshot("__snapshots__/public-exports.txt")
})
