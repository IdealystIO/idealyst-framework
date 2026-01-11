import type { IConfig } from './types'
import { ConfigValidationError } from './types'

/**
 * Config store - initialized from react-native-config, can be overridden via setConfig().
 */
let configStore: Record<string, string> = {}

/**
 * Initialize from react-native-config if available.
 */
function initFromRNConfig(): void {
  try {
    // Dynamic import to handle cases where react-native-config is not installed
    const RNConfig = require('react-native-config').default || require('react-native-config')
    if (RNConfig && typeof RNConfig === 'object') {
      configStore = { ...RNConfig }
    }
  } catch {
    // react-native-config not available - configStore remains empty
    // Values will be injected by Babel plugin via setConfig()
  }
}

// Initialize on module load
initFromRNConfig()

/**
 * Set config values. Called by Babel plugin at compile time,
 * or can be called manually.
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
 * Native implementation of IConfig.
 *
 * Config values come from:
 * 1. react-native-config (if installed)
 * 2. Babel plugin injection via setConfig()
 * 3. Manual setConfig() calls
 */
class NativeConfig implements IConfig {
  get(key: string, defaultValue?: string): string | undefined {
    return configStore[key] ?? defaultValue
  }

  getRequired(key: string): string {
    const value = this.get(key)
    if (value === undefined) {
      throw new Error(
        `Required config key "${key}" is not defined. ` +
        `Make sure ${key} is set in your .env file.`
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

export default NativeConfig
export { NativeConfig }
