export * from './types'

import type { OAuthConfig, OAuthClient, OAuthResult } from './types'
import { NativeOAuthClient } from './oauth-client.native'

export function createOAuthClient<T = OAuthResult>(config: OAuthConfig<T>): OAuthClient<T> {
  return new NativeOAuthClient<T>(config)
}

export { NativeOAuthClient }