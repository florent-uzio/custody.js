/**
 * Cache entry with expiration time
 */
interface CacheEntry<T> {
  value: T
  expiresAt: number
}

/**
 * Options for DomainCacheService
 */
export interface DomainCacheOptions {
  /** Time to live in milliseconds (default: 300000 = 5 minutes) */
  ttlMs?: number
}

/**
 * Lightweight cache service for storing domain-related information.
 * Implements TTL-based expiration to ensure data freshness.
 */
export class DomainCacheService {
  private readonly ttlMs: number
  private readonly cache: Map<string, CacheEntry<unknown>>

  constructor(options: DomainCacheOptions = {}) {
    this.ttlMs = options.ttlMs ?? 300000 // 5 minutes default
    this.cache = new Map()
  }

  /**
   * Store a value in the cache with TTL
   * @param key - Cache key
   * @param value - Value to cache
   */
  set<T>(key: string, value: T): void {
    // TTL of 0 means caching is disabled
    if (this.ttlMs === 0) {
      return
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    })
  }

  /**
   * Retrieve a value from the cache
   * @param key - Cache key
   * @returns The cached value, or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined

    if (!entry) {
      return undefined
    }

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return undefined
    }

    return entry.value
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key - Cache key
   * @returns true if the key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Remove a specific key from the cache
   * @param key - Cache key to remove
   */
  delete(key: string): void {
    this.cache.delete(key)
  }
}
