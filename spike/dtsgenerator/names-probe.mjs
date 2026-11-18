import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const { toTypeName } = require("dtsgenerator/dist/core/validateIdentifier.js")
for (const s of [
  "/v1/domains/{domainId}/users/invitations",
  "/v1/domains/{domainId}/users/invitations/{id}",
  "Core_Foo",
  "getBackup",
  "get_user_X",
  "/v1/users/invitations/{idOrCode}",
  "/internal/v1/me/settings/notifications",
]) {
  console.log(JSON.stringify(s), "->", toTypeName(s, 99))
}
