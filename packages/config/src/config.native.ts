import type { IConfig } from './types'
import { ConfigValidationError } from './types'

// react-native-config provides a Config object with all env variables
// eslint-disable-next-line @typescript-eslint/no-var-requires
let RNConfig: Record<string, string | undefined> = {}

try {
  // Dynamic import to handle cases where react-native-config is not installed
  // This allows the package to be used in web-only projects without errors
  RNConfig = require('react-native-config').default || require('react-native-config')
} catch {
  // react-native-config not available - will be empty object
  // This is expected in web environments or when the native module isn't linked
}

/**
 * Native implementation of IConfig using react-native-config.
 *
 * This implementation provides direct access to .env variables without
 * any prefix transformation, as react-native-config doesn't require prefixes.
 *
 * The .env file should use canonical names:
 * API_URL=https://api.example.com
 * GOOGLE_CLIENT_ID=abc123
 */
class NativeConfig implements IConfig {
  get(key: string, defaultValue?: string): string | undefined {
    return RNConfig[key] ?? defaultValue
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
    return RNConfig[key] !== undefined
  }

  keys(): string[] {
    return Object.keys(RNConfig)
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
