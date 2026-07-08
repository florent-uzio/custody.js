---
name: fetch-openapi-spec
description: "Download the OpenAPI spec attached to an official Ripple Custody GitLab release and save it into openapi/official/. Use when the user wants to add/update an official spec, mentions a GitLab release URL for the custody releases project, or asks to fetch/sync the OpenAPI json for a given version."
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

1. Determine the version tag (e.g. `1.35.0`) from the user's request — they
   may paste a release URL like
   `https://gitlab.com/<group>/<project>/-/releases/<version>`, in which case
   the tag is the last path segment. `latest` is also accepted.
2. Run:
   ```
   GITLAB_TOKEN=<token> GITLAB_PROJECT_PATH=<group>/<project> npm run fetch:openapi-spec -- <version>
   ```
3. The script:
   - Looks up the release via the GitLab Releases API.
   - Finds the single asset link matching `openapi-*.json`.
   - Resolves its GitLab CI job artifact URL and downloads the file through
     the Job Artifacts API (the asset's `direct_asset_url` itself sits behind
     GitLab Pages SSO and is not fetchable with a PAT).
   - Validates the downloaded JSON has `info.x-app-version` before saving.
   - Saves it as `openapi/official/<original-asset-name>.json` (filename is
     whatever GitLab called it — the channel folder is what matters, not the
     filename; see ADR-0005).
4. After a successful download, remind the user to run
   `npm run generate:custody-types` to regenerate
   `src/models/custody-types.ts` and `src/models/capabilities.generated.ts`,
   and to check whether a changeset is needed for the resulting type changes.

## Troubleshooting

- **401/403 from the GitLab API**: token is missing, expired, or lacks
  `read_api` scope / project access.
- **404 on the release lookup**: either `GITLAB_PROJECT_PATH` is wrong, or
  the tag doesn't exist in that project — double check both.
- **"No OpenAPI asset found"**: the release has no `openapi-*.json` link;
  print the asset names from the error and ask the user how to proceed.
