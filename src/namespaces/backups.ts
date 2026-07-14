import { URLs } from "../constants/urls.js"
import type { Transport } from "../transport/index.js"
import type {
  Core_ApiBackup,
  Core_ApiTrustedBackup,
  Core_BackupsCollection,
  GetBackupPathParams,
  GetBackupsQueryParams,
  GetBackupTrustedEntityPathParams,
} from "./backups.types.js"

export function createBackups(t: Transport) {
  return {
    list: (queryParams?: GetBackupsQueryParams): Promise<Core_BackupsCollection> =>
      t.get(URLs.backups, undefined, queryParams),

    get: (params: GetBackupPathParams): Promise<Core_ApiBackup> => t.get(URLs.backup, params),

    getTrustedEntity: (params: GetBackupTrustedEntityPathParams): Promise<Core_ApiTrustedBackup> =>
      t.get(URLs.backupTrustedEntity, params),
  } as const
}
