export * from './types'

import type { OAuthConfig, OAuthClient, OAuthResult } from './types'
import { WebOAuthClient } from './oauth-client.web'

export function createOAuthClient<T = OAuthResult>(config: OAuthConfig<T>): OAuthClient<T> {
  return new WebOAuthClient<T>(config)
}

export { WebOAuthClient }