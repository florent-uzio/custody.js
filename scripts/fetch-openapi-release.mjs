#!/usr/bin/env node
/**
 * Downloads the OpenAPI spec attached to an official Ripple Custody GitLab
 * release and saves it under openapi/official/, matching the channel layout
 * from docs/adr/0005-official-vs-devbox-channels.md.
 *
 * Usage:
 *   GITLAB_TOKEN=<personal-access-token> GITLAB_PROJECT_PATH=<group>/<project> \
 *     node scripts/fetch-openapi-release.mjs <version|latest>
 *
 * GITLAB_TOKEN needs at least `read_api` scope on gitlab.com.
 * GITLAB_PROJECT_PATH is internal to Ripple and intentionally not hardcoded
 * here since this repo is public — ask a teammate for it.
 */
import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, "..")
const outDir = join(repoRoot, "openapi", "official")

const GITLAB_API = "https://gitlab.com/api/v4"

function gitlabHeaders() {
  const token = process.env.GITLAB_TOKEN
  if (!token) {
    throw new Error(
      "GITLAB_TOKEN is not set. Create a GitLab personal access token with `read_api` scope " +
        "for gitlab.com and export it as GITLAB_TOKEN.",
    )
  }
  return { "PRIVATE-TOKEN": token }
}

function getProjectPath() {
  const projectPath = process.env.GITLAB_PROJECT_PATH
  if (!projectPath) {
    throw new Error(
      "GITLAB_PROJECT_PATH is not set. Export the GitLab group/project path (e.g. " +
        "`export GITLAB_PROJECT_PATH=<group>/<project>`) — ask a teammate for the value.",
    )
  }
  return projectPath
}

async function gitlabGet(path) {
  const url = `${GITLAB_API}${path}`
  const res = await fetch(url, { headers: gitlabHeaders() })
  if (!res.ok) {
    throw new Error(`GitLab API request failed (${res.status} ${res.statusText}): ${url}`)
  }
  return res
}

async function fetchRelease(version) {
  const projectId = encodeURIComponent(getProjectPath())
  const releasePath =
    version === "latest"
      ? `/projects/${projectId}/releases/permalink/latest`
      : `/projects/${projectId}/releases/${encodeURIComponent(version)}`
  const res = await gitlabGet(releasePath)
  return res.json()
}

function findOpenApiLink(release) {
  const links = release.assets?.links ?? []
  const matches = links.filter((link) => /^openapi-.*\.json$/i.test(link.name))
  if (matches.length === 0) {
    throw new Error(
      `No OpenAPI asset found on release "${release.tag_name}". Asset names: ` +
        links.map((l) => l.name).join(", "),
    )
  }
  if (matches.length > 1) {
    throw new Error(
      `Multiple OpenAPI assets found on release "${release.tag_name}": ` +
        matches.map((l) => l.name).join(", "),
    )
  }
  return matches[0]
}

function parseJobArtifact(url) {
  const match = url.match(/\/-\/jobs\/(\d+)\/artifacts\/(.+)$/)
  if (!match) {
    throw new Error(`Could not parse job artifact URL: ${url}`)
  }
  const [, jobId, artifactPath] = match
  return { jobId, artifactPath }
}

async function downloadArtifact(jobId, artifactPath) {
  const projectId = encodeURIComponent(getProjectPath())
  const encodedPath = artifactPath.split("/").map(encodeURIComponent).join("/")
  const res = await gitlabGet(`/projects/${projectId}/jobs/${jobId}/artifacts/${encodedPath}`)
  return res.text()
}

async function main() {
  const version = process.argv[2]
  if (!version) {
    console.error("Usage: node scripts/fetch-openapi-release.mjs <version|latest>")
    process.exit(1)
  }

  console.log(`Looking up release "${version}" in ${getProjectPath()}...`)
  const release = await fetchRelease(version)
  const link = findOpenApiLink(release)
  console.log(`Found asset: ${link.name}`)

  const { jobId, artifactPath } = parseJobArtifact(link.direct_asset_url ?? link.url)
  const body = await downloadArtifact(jobId, artifactPath)

  const doc = JSON.parse(body)
  const appVersion = doc?.info?.["x-app-version"]
  if (!appVersion) {
    throw new Error(`Downloaded file has no info.x-app-version — refusing to save: ${link.name}`)
  }

  const outPath = join(outDir, link.name)
  writeFileSync(outPath, body)
  console.log(`Saved ${outPath} (x-app-version: ${appVersion})`)
  console.log("Next: npm run generate:custody-types")
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
