import type { AuthService } from "../services/auth/index.js"

/** Auth namespace — current JWT token and its expiration. */
export function createAuth(authService: AuthService) {
  return {
    /**
     * @returns The current JWT token.
     */
    getCurrentToken: () => authService.getCurrentToken(),

    /**
     * @returns The current JWT token expiration, if available.
     */
    getTokenExpiration: () => authService.getTokenExpiration(),
  } as const
}
