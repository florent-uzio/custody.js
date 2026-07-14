/**
 * Domain and user reference resolved from the user's context.
 */
export type DomainUserReference = {
  domainId: string
  userId: string
}

/**
 * Options for resolving domain context.
 */
export type DomainResolveOptions = {
  /**
   * Specific domain ID to use. If not provided and user has multiple domains,
   * an error will be thrown.
   */
  domainId?: string
}
