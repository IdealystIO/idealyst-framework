// This file should not be used - use index.web.ts or index.native.ts instead
export * from './types'

// Fallback export that throws an error
export function createOAuthClient(): never {
  throw new Error(
    '@idealyst/oauth-client: Platform-specific bundle not found. ' +
    'Make sure your bundler is configured to use .web.ts or .native.ts files.'
  )
}