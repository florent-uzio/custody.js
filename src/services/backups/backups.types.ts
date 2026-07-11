import type { components, operations } from "../../models/custody-types.js"

// Request types

export type GetBackupsQueryParams = operations["getBackups"]["parameters"]["query"]

export type GetBackupPathParams = operations["getBackup"]["parameters"]["path"]

export type GetBackupTrustedEntityPathParams =
  operations["getBackupTrustedEntity"]["parameters"]["path"]

// Response types

export type Core_BackupsCollection = components["schemas"]["Core_BackupsCollection"]

export type Core_ApiBackup = components["schemas"]["Core_ApiBackup"]

export type Core_ApiTrustedBackup = components["schemas"]["Core_ApiTrustedBackup"]
