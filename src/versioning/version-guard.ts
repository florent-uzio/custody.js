import { CAPABILITIES, type KnownAppVersion } from "../models/capabilities.generated.js"
import { CustodyError } from "../models/index.js"

/** Whether a capability is a whole endpoint or a feature carried inside one. */
export type CapabilityKind = "endpoint" | "feature"

/**
 * The capability set the guard checks against: the endpoints and component
 * schemas a single resolved backend version exposes.
 */
export type ResolvedCapabilities = {
  /** The resolved app version (`x-app-version`), used for messaging. */
  appVersion: string
  /** Endpoint capabilities, each formatted `METHOD /path-template`. */
  endpoints: ReadonlySet<string>
  /** Feature capabilities: the names of component schemas the version defines. */
  schemas: ReadonlySet<string>
}

/**
 * Thrown when a call needs a capability the resolved backend version does not
 * support. Extends {@link CustodyError} so existing `catch (CustodyError)`
 * handlers still catch it.
 */
export class UnsupportedInVersionError extends CustodyError {
  public readonly capability: string
  public readonly kind: CapabilityKind
  public readonly appVersion: string
  public readonly sdkMethod: string

  constructor(args: {
    capability: string
    kind: CapabilityKind
    appVersion: string
    sdkMethod: string
  }) {
    super({
      reason:
        `${args.sdkMethod} requires ${args.kind} "${args.capability}", which is not ` +
        `available on the resolved backend version ${args.appVersion}.`,
    })
    this.name = "UnsupportedInVersionError"
    this.capability = args.capability
    this.kind = args.kind
    this.appVersion = args.appVersion
    this.sdkMethod = args.sdkMethod
  }
}

/**
 * Maps an XRPL operation `type` (the discriminator of `Core_XrplOperation`) to
 * its component-schema name. The generated union members are named
 * `Core_XrplOperation_<type>` exactly, so no lookup table is needed.
 */
export function xrplOperationSchema(operationType: string): string {
  return `Core_XrplOperation_${operationType}`
}

/**
 * Builds the capability set for an explicitly-requested app version from the
 * bundled capability data. Throws when the version is not bundled.
 */
export function resolveExplicitCapabilities(apiVersion: string): ResolvedCapabilities {
  const entry = CAPABILITIES[apiVersion as KnownAppVersion]
  if (!entry) {
    const known = Object.keys(CAPABILITIES).join(", ")
    throw new CustodyError({
      reason: `Unknown apiVersion "${apiVersion}". Known versions: ${known}.`,
    })
  }
  return {
    appVersion: apiVersion,
    endpoints: new Set(entry.endpoints),
    schemas: new Set(entry.schemas),
  }
}

/**
 * Runtime guard that blocks calls the resolved backend version cannot serve.
 *
 * When constructed with no resolved capabilities it is a **pass-through**: every
 * check is a no-op (fail-open). The backend remains the ultimate authority.
 */
export class VersionGuard {
  private resolved: ResolvedCapabilities | undefined
  private settled: boolean
  private pending?: Promise<void>
  private readonly resolver?: () => Promise<ResolvedCapabilities | undefined>

  /**
   * Construct a guard with capabilities already resolved (or `undefined` for a
   * pass-through guard). Pass a `resolver` for lazy resolution, or use
   * {@link VersionGuard.deferred}.
   */
  constructor(
    resolved: ResolvedCapabilities | undefined,
    resolver?: () => Promise<ResolvedCapabilities | undefined>,
  ) {
    this.resolved = resolved
    this.resolver = resolver
    this.settled = resolver === undefined
  }

  /**
   * Construct a guard whose capabilities are resolved lazily on first use (e.g.
   * by fetching the live instance spec). The resolver runs at most once per
   * successful resolution; concurrent triggers share a single invocation.
   */
  static deferred(resolver: () => Promise<ResolvedCapabilities | undefined>): VersionGuard {
    return new VersionGuard(undefined, resolver)
  }

  /** Whether the guard has a resolved version and is actively gating. */
  get isActive(): boolean {
    return this.resolved !== undefined
  }

  /**
   * Resolve the capability set if not already resolved. Idempotent and
   * concurrency-safe: parallel calls share one in-flight resolution. On failure
   * the error propagates and a later call retries.
   */
  async ensureResolved(): Promise<void> {
    if (this.settled) return
    if (!this.pending) {
      const resolver = this.resolver!
      this.pending = resolver().then(
        (caps) => {
          this.resolved = caps
          this.settled = true
        },
        (error: unknown) => {
          this.pending = undefined
          throw error
        },
      )
    }
    return this.pending
  }

  /** Resolves (detecting if needed) then asserts the endpoint capability. */
  async checkEndpoint(httpMethod: string, pathTemplate: string, sdkMethod?: string): Promise<void> {
    await this.ensureResolved()
    this.assertEndpoint(httpMethod, pathTemplate, sdkMethod)
  }

  /** Resolves (detecting if needed) then asserts the feature capability. */
  async checkFeature(schemaName: string, sdkMethod: string): Promise<void> {
    await this.ensureResolved()
    this.assertFeature(schemaName, sdkMethod)
  }

  /**
   * Asserts the resolved version serves `METHOD /pathTemplate`.
   * @param sdkMethod - Label for the error (defaults to the HTTP descriptor).
   */
  assertEndpoint(httpMethod: string, pathTemplate: string, sdkMethod?: string): void {
    if (!this.resolved) return
    const capability = `${httpMethod.toUpperCase()} ${pathTemplate}`
    if (!this.resolved.endpoints.has(capability)) {
      throw new UnsupportedInVersionError({
        capability,
        kind: "endpoint",
        appVersion: this.resolved.appVersion,
        sdkMethod: sdkMethod ?? capability,
      })
    }
  }

  /** Asserts the resolved version defines the component schema `schemaName`. */
  assertFeature(schemaName: string, sdkMethod: string): void {
    if (!this.resolved) return
    if (!this.resolved.schemas.has(schemaName)) {
      throw new UnsupportedInVersionError({
        capability: schemaName,
        kind: "feature",
        appVersion: this.resolved.appVersion,
        sdkMethod,
      })
    }
  }
}
