/**
 * Native entry point for @idealyst/config
 *
 * Config values come from:
 * 1. react-native-config (if installed)
 * 2. Babel plugin injection via setConfig()
 *
 * @example
 * ```typescript
 * import { config } from '@idealyst/config'
 *
 * // In your .env file: API_URL=https://api.example.com
 * const apiUrl = config.get('API_URL')
 * ```
 */

import NativeConfig, { setConfig, clearConfig, getConfigStore } from './config.native'

// Create singleton instance for native
const config = new NativeConfig()

export default config
export { config, config as Config, NativeConfig, setConfig, clearConfig, getConfigStore }
export * from './types'
