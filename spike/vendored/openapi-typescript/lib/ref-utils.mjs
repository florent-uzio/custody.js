// Replaces the two helpers used from @redocly/openapi-core/lib/ref-utils.js
export function escapePointer(fragment) {
  if (typeof fragment === "number") return fragment
  return fragment.replace(/~/g, "~0").replace(/\//g, "~1")
}
function unescapePointer(fragment) {
  return decodeURIComponent(fragment.replace(/~1/g, "/").replace(/~0/g, "~"))
}
export function parseRef(ref) {
  const [uri, pointer = ""] = ref.split("#/")
  return {
    uri: (uri.endsWith("#") ? uri.slice(0, -1) : uri) || null,
    pointer: pointer.split("/").map(unescapePointer).filter(Boolean),
  }
}
