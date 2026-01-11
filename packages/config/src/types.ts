/**
 * Base config interface for cross-platform configuration access.
 * This interface can be augmented by generated types for autocomplete support.
 */
export interface IConfig {
  /**
   * Get a configuration value by key.
   * @param key - The canonical key name (without VITE_ prefix)
   * @param defaultValue - Optional default value if key is not set
   * @returns The value, the default value, or undefined if not set
   */
  get(key: string, defaultValue?: string): string | undefined

  /**
   * Get a required configuration value. Throws if not set.
   * @param key - The canonical key name (without VITE_ prefix)
   * @returns The value
   * @throws Error if the key is not defined
   */
  getRequired(key: string): string

  /**
   * Check if a configuration key exists.
   * @param key - The canonical key name (without VITE_ prefix)
   * @returns True if the key is defined
   */
  has(key: string): boolean

  /**
   * Get all available configuration keys.
   * @returns Array of canonical key names
   */
  keys(): string[]

  /**
   * Validate that all required keys are present.
   * @param requiredKeys - Array of required key names
   * @throws ConfigValidationError if any keys are missing
   */
  validate(requiredKeys: string[]): void
}

/**
 * Error thrown when required configuration keys are missing.
 */
export class ConfigValidationError extends Error {
  /**
   * The list of missing configuration keys.
   */
  public readonly missingKeys: string[]

  constructor(missingKeys: string[]) {
    super(`Missing required config keys: ${missingKeys.join(', ')}`)
    this.name = 'ConfigValidationError'
    this.missingKeys = missingKeys
  }
}

/**
 * Interface for ConfigKeys - augmented by generated types.
 * When you run `idealyst-config generate`, this interface is extended
 * with your actual environment variable keys.
 */
export interface ConfigKeys {
  [key: string]: string
}
