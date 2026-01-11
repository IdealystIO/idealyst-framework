/**
 * @idealyst/config - Cross-platform configuration for React and React Native
 *
 * This is the generic entry point that exports types and the base interface.
 * Platform-specific entry points (index.web.ts, index.native.ts) export
 * pre-configured instances for their respective platforms.
 *
 * @example
 * ```typescript
 * import { config } from '@idealyst/config'
 *
 * // Get a config value
 * const apiUrl = config.get('API_URL')
 *
 * // Get with default
 * const port = config.get('PORT', '3000')
 *
 * // Get required (throws if missing)
 * const secret = config.getRequired('JWT_SECRET')
 *
 * // Validate at startup
 * config.validate(['API_URL', 'JWT_SECRET'])
 * ```
 */

export * from './types'
export type { IConfig, ConfigKeys } from './types'
export { ConfigValidationError } from './types'
