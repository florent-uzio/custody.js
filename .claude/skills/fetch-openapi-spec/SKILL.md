---
name: fetch-openapi-spec
description: "Sync official Ripple Custody OpenAPI specs from GitLab releases into openapi/official/: fetch, regenerate types, diff against the previous release, add a changeset. Use when the user wants to add, update or sync an official spec, or mentions a GitLab release URL for the custody releases project."
---

# Fetch OpenAPI spec

Downloads the `openapi-*.json` asset from an official Ripple Custody release
in Ripple's internal GitLab releases project and saves it under
`openapi/official/`, per
[ADR-0005](../../../docs/adr/0005-official-vs-devbox-channels.md).

This only covers **official** releases. Devbox/feature-branch specs are not
published as GitLab releases and must be added another way (e.g. exported
from a live devbox instance's `/api/OpenAPI` endpoint).

This repo is public — never hardcode the internal GitLab project path, an
example release URL, or a token into any committed file. Both required
values below are supplied locally at runtime only.

## Prerequisites

- `GITLAB_TOKEN` env var: a GitLab personal access token for gitlab.com with
  at least `read_api` scope, and access to the internal custody releases
  project. Ask the user for one if it isn't already set — do not guess or
  reuse a token from elsewhere in the conversation without confirming it's
  still meant for this purpose. Never print the token value.
- `GITLAB_PROJECT_PATH` env var: the `<group>/<project>` path of Ripple's
  internal GitLab releases project. Ask the user (or check their shell
  profile) if it isn't already set.

## Steps

A sync runs end to end: fetch, generate, diff, changeset, CI, report. The
user usually names one version per release line (e.g. `1.43.8 and 1.34.28`).

1. Determine each version tag from the request. A pasted release URL like
   `https://gitlab.com/<group>/<project>/-/releases/<version>` carries the tag
   as its last path segment; `latest` is also accepted. For each tag, note the
   **previous** spec on the same release line: the highest patch of
   `openapi/official/openapi-<major>-<minor>-*.json` already on disk.
2. Branch from an up-to-date `main`.
3. For each version, run:
   ```
   GITLAB_TOKEN=<token> GITLAB_PROJECT_PATH=<group>/<project> npm run fetch:openapi-spec -- <version>
   ```
   The script looks up the release, downloads its `openapi-*.json` asset
   through the Job Artifacts API (the asset's `direct_asset_url` sits behind
   GitLab Pages SSO), checks `info.x-app-version`, and saves it under
   `openapi/official/` with GitLab's asset name.
4. Run `npm run generate:custody-types`.
5. For each version, run `npm run diff:openapi -- <previous> <version>`. It
   lists operations and schemas added, removed and changed. This is the source
   for the API impact; `capabilities.generated.ts` always gains the new
   version keys, and its diff needs no further inspection.
6. For every added or changed operation and schema, find the namespace that
   covers it under `src/namespaces/` and decide whether the SDK needs a new
   namespace, a new method, or nothing (changed generated types flow through
   on their own). Done when every item in the diff has a verdict.
7. Write a new changeset `.changeset/openapi-<version>-<version>.md` (dots
   become dashes), bump `minor`, describing the API changes from step 5, or
   "No API changes" when the diff is empty. Use the existing
   `openapi-*` changesets in git history as the template.
8. Run `npm run ci`. Done when it passes.
9. Report to the user: the specs added, the diff summary per version, and
   the verdict from step 6 (new namespace / new endpoints needed or not).

## Troubleshooting

- **401/403 from the GitLab API**: token is missing, expired, or lacks
  `read_api` scope / project access.
- **404 on the release lookup**: either `GITLAB_PROJECT_PATH` is wrong, or
  the tag doesn't exist in that project — double check both.
- **"No OpenAPI asset found"**: the release has no `openapi-*.json` link;
  print the asset names from the error and ask the user how to proceed.
