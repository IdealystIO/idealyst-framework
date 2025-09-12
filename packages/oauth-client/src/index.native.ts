export * from './types'

import type { OAuthConfig, OAuthClient } from './types'
import { NativeOAuthClient } from './oauth-client.native'

export function createOAuthClient(config: OAuthConfig): OAuthClient {
  return new NativeOAuthClient(config)
}

export { NativeOAuthClient }