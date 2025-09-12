export * from './types'

import type { OAuthConfig, OAuthClient } from './types'
import { WebOAuthClient } from './oauth-client.web'

export function createOAuthClient(config: OAuthConfig): OAuthClient {
  return new WebOAuthClient(config)
}

export { WebOAuthClient }