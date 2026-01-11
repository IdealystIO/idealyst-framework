import type { IConfig } from './types'
import { ConfigValidationError } from './types'

/**
 * Config store - populated by the generated config module or manually via setConfig().
 */
let configStore: Record<string, string> = {}

/**
 * Set config values. Called automatically when importing from a project that
 * has generated config, or can be called manually.
 *
 * @example
 * ```typescript
 * // In your app entry point:
 * import { setConfig } from '@idealyst/config'
 * import { generatedConfig } from './config.generated'
 *
 * setConfig(generatedConfig)
 * ```
 */
export function setConfig(config: Record<string, string>): void {
  configStore = { ...configStore, ...config }
}

/**
 * Clear all config values. Useful for testing.
 */
export function clearConfig(): void {
  configStore = {}
}

/**
 * Get the raw config store. Useful for debugging.
 */
export function getConfigStore(): Record<string, string> {
  return { ...configStore }
}

/**
 * Web implementation of IConfig.
 *
 * Config values come from:
 * 1. Generated config module (via setConfig)
 * 2. Manual setConfig() calls
 *
 * Usage:
 * ```typescript
 * import { config, setConfig } from '@idealyst/config'
 * import { generatedConfig } from './config.generated'
 *
 * // Initialize config (do this once at app startup)
 * setConfig(generatedConfig)
 *
 * // Then use anywhere
 * const apiUrl = config.get('API_URL')
 * ```
 */
class WebConfig implements IConfig {
  get(key: string, defaultValue?: string): string | undefined {
    return configStore[key] ?? defaultValue
  }

  getRequired(key: string): string {
    const value = this.get(key)
    if (value === undefined) {
      throw new Error(
        `Required config key "${key}" is not defined. ` +
        `Make sure you've run "idealyst-config generate" and imported the generated config.`
      )
    }
    return value
  }

  has(key: string): boolean {
    return configStore[key] !== undefined
  }

  keys(): string[] {
    return Object.keys(configStore).sort()
  }

  validate(requiredKeys: string[]): void {
    const missing = requiredKeys.filter(key => !this.has(key))
    if (missing.length > 0) {
      throw new ConfigValidationError(missing)
    }
  }
}

export default WebConfig
export { WebConfig }
