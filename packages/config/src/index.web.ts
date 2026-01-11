/**
 * Web entry point for @idealyst/config
 *
 * Config values come from a generated module created by the CLI.
 * This approach works with any bundler and supports env inheritance.
 *
 * @example
 * ```typescript
 * // 1. Generate config (run in terminal)
 * // idealyst-config generate --extends ../shared/.env --env .env
 *
 * // 2. Initialize in your app entry point
 * import { config, setConfig } from '@idealyst/config'
 * import { generatedConfig } from './config.generated'
 * setConfig(generatedConfig)
 *
 * // 3. Use anywhere
 * const apiUrl = config.get('API_URL')
 * ```
 */

import WebConfig, { setConfig, clearConfig, getConfigStore } from './config.web'

// Create singleton instance for web
const config = new WebConfig()

export default config
export { config, config as Config, WebConfig, setConfig, clearConfig, getConfigStore }
export * from './types'
