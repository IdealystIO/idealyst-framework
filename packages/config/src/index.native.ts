/**
 * Native entry point for @idealyst/config
 *
 * Uses react-native-config for environment variable access.
 * No prefix is required - use canonical names directly.
 *
 * @example
 * ```typescript
 * import { config } from '@idealyst/config'
 *
 * // In your .env file: API_URL=https://api.example.com
 * const apiUrl = config.get('API_URL')
 * ```
 */

import NativeConfig from './config.native'

// Create singleton instance for native
const config = new NativeConfig()

export default config
export { config, config as Config, NativeConfig }
export * from './types'
