# vendor/ — temporary xrpl.js builds for confidential MPTs

These tarballs are local `npm pack` outputs of the **unreleased**
[`XRPLF/xrpl.js@confidential-mpts`](https://github.com/XRPLF/xrpl.js/tree/confidential-mpts)
branch, at commit `63af7e9`. They exist only so this branch can use the
XLS-96 confidential-MPT surface before XRPLF publishes it to npm.

| Tarball                                                   | Source package                 |
| --------------------------------------------------------- | ------------------------------ |
| `xrpl-5.0.0-confidential-mpts.63af7e9.tgz`                | `packages/xrpl`                |
| `ripple-binary-codec-2.8.0-confidential-mpts.63af7e9.tgz` | `packages/ripple-binary-codec` |

## Why both packages

The branch does not bump any version numbers — `xrpl` is still `5.0.0` and
`ripple-binary-codec` is still `2.8.0` — but `ripple-binary-codec`'s
`definitions.json` gains 5 transaction types (`ConfidentialMPTClawback`,
`ConfidentialMPTConvert`, `ConfidentialMPTConvertBack`,
`ConfidentialMPTMergeInbox`, `ConfidentialMPTSend`) and 18 fields. Installing
only `xrpl` would resolve `ripple-binary-codec@2.8.0` from the registry and
silently fail to serialize any confidential transaction, so `package.json`
pins it through an `overrides` entry.

`@xrplf/mpt-crypto` (the WASM proof/ElGamal package) is **not** vendored. It is
an optional peer dependency that `xrpl` lazily imports only from the
`xrpl/confidential` subpath, which this SDK does not use. Add it here if
client-side proof generation is ever needed.

## Publishing

`vendor/` is **not** in the package's `files` list, so it is not published. A
consumer installing a release that referenced `file:vendor/...tgz` would fail
with `ENOENT`, and `overrides` are ignored when a package is installed as a
dependency rather than as the root project. Both problems are solved by
`bundleDependencies` in `package.json`:

```json
"bundleDependencies": ["xrpl", "ripple-binary-codec"]
```

npm then packs the installed `node_modules/xrpl` and
`node_modules/ripple-binary-codec` trees into the published tarball, so the
consumer resolves the forked builds from
`node_modules/@florent-uzio/custody/node_modules/`. This grows the package from
~0.3 MB to ~3.6 MB.

Note that this covers the SDK's _own_ use of `xrpl`. A consumer who imports
`xrpl` directly in their app still gets whatever version they installed
themselves — to author confidential MPT transactions they must vendor this same
branch in their own project.

Remove the `bundleDependencies` entry at the same time as the rest of this
directory.

## Reproducing

```sh
git clone --branch confidential-mpts --single-branch https://github.com/XRPLF/xrpl.js.git
cd xrpl.js && git checkout 63af7e9
npm ci && npx lerna run build --stream
npm pack --workspace ripple-binary-codec --workspace xrpl --pack-destination <repo>/vendor
# then rename each tarball with the -confidential-mpts.<sha> suffix
```

## Removing

When XRPLF ships this (likely as a `confidential-mpts-experimental` dist-tag,
as was done for `batch-experimental`), delete this directory, drop the
`overrides` block from `package.json`, restore `"xrpl": "^<version>"`, and drop
the `!vendor/*.tgz` negation from `.gitignore`.
