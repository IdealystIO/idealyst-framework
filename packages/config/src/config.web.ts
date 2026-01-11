import type { IConfig } from './types'
import { ConfigValidationError } from './types'

/**
 * Web implementation of IConfig using Vite's import.meta.env.
 *
 * This implementation automatically handles the VITE_ prefix:
 * - User code uses canonical names: config.get('API_URL')
 * - Internally we look up: import.meta.env.VITE_API_URL
 *
 * This allows the same code to work on both web and native platforms.
 */
class WebConfig implements IConfig {
  get(key: string, defaultValue?: string): string | undefined {
    // Always use VITE_ prefix - this is the Vite convention for exposing
    // environment variables to client-side code.
    // User code uses canonical names: config.get('API_URL')
    // Internally we look up: import.meta.env.VITE_API_URL
    const value = (import.meta.env as Record<string, string | undefined>)[`VITE_${key}`]
    return value ?? defaultValue
  }

  getRequired(key: string): string {
    const value = this.get(key)
    if (value === undefined) {
      throw new Error(
        `Required config key "${key}" is not defined. ` +
        `Make sure VITE_${key} is set in your .env file.`
      )
    }
    return value
  }

  has(key: string): boolean {
    return (import.meta.env as Record<string, string | undefined>)[`VITE_${key}`] !== undefined
  }

  keys(): string[] {
    // Return canonical names (strip VITE_ prefix)
    return Object.keys(import.meta.env)
      .filter(k => k.startsWith('VITE_'))
      .map(k => k.replace(/^VITE_/, ''))
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
