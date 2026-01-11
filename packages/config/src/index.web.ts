/**
 * Web entry point for @idealyst/config
 *
 * Uses Vite's import.meta.env for environment variable access.
 * The VITE_ prefix is handled automatically - use canonical names in your code.
 *
 * @example
 * ```typescript
 * import { config } from '@idealyst/config'
 *
 * // In your .env file: VITE_API_URL=https://api.example.com
 * // In your code: use canonical name without prefix
 * const apiUrl = config.get('API_URL')
 * ```
 */

import WebConfig from './config.web'

// Create singleton instance for web
const config = new WebConfig()

export default config
export { config, config as Config, WebConfig }
export * from './types'
