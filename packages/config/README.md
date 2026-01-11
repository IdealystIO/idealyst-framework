# @idealyst/config

Cross-platform configuration and environment variable support for React and React Native applications.

## Features

- **Single API** - Same code works on web and native
- **Type-safe** - Auto-generated TypeScript declarations for autocomplete
- **Prefix abstraction** - Use canonical names (`API_URL`), web implementation handles `VITE_` prefix internally
- **Validation** - Check required config at app startup
- **Zero runtime dependencies** - Uses platform-native solutions

## Installation

```bash
npm install @idealyst/config

# For React Native, also install react-native-config
npm install react-native-config
cd ios && pod install
```

## Quick Start

```typescript
import { config } from '@idealyst/config'

// Get a config value
const apiUrl = config.get('API_URL')

// Get with default value
const port = config.get('PORT', '3000')

// Get required value (throws if missing)
const secret = config.getRequired('JWT_SECRET')

// Validate required vars at startup
config.validate(['API_URL', 'AUTH_SECRET'])
```

## Environment Files

### React Native (.env)

```bash
# No prefix needed
API_URL=https://api.example.com
GOOGLE_CLIENT_ID=abc123
JWT_SECRET=supersecret
```

### Vite Web (.env)

```bash
# Must use VITE_ prefix for client exposure
VITE_API_URL=https://api.example.com
VITE_GOOGLE_CLIENT_ID=abc123
VITE_JWT_SECRET=supersecret
```

**Important:** Your code always uses canonical names without the `VITE_` prefix. The web implementation handles this internally:

```typescript
// Both platforms - same code
const apiUrl = config.get('API_URL')
```

## Type Generation

Generate TypeScript declarations for autocomplete support:

```bash
# Auto-detect .env file
npx idealyst-config generate

# Specify .env file
npx idealyst-config generate --env .env.local

# Custom output path
npx idealyst-config generate --output types/env.d.ts
```

This creates a declaration file that provides autocomplete for your config keys:

```typescript
// Generated: src/env.d.ts
declare module '@idealyst/config' {
  interface ConfigKeys {
    API_URL: string
    GOOGLE_CLIENT_ID: string
    JWT_SECRET: string
  }
}
```

Now you get autocomplete when calling `config.get()`:

```typescript
config.get('API_URL')  // Autocomplete shows available keys
config.get('INVALID')  // TypeScript error - key not in ConfigKeys
```

## API Reference

### `config.get(key: string): string | undefined`

Get a configuration value by key.

```typescript
const apiUrl = config.get('API_URL')
```

### `config.get(key: string, defaultValue: string): string`

Get a configuration value with a fallback default.

```typescript
const port = config.get('PORT', '3000')
```

### `config.getRequired(key: string): string`

Get a required configuration value. Throws an error if not defined.

```typescript
const secret = config.getRequired('JWT_SECRET')
// Throws: 'Required config key "JWT_SECRET" is not defined'
```

### `config.has(key: string): boolean`

Check if a configuration key exists.

```typescript
if (config.has('DEBUG')) {
  enableDebugMode()
}
```

### `config.keys(): string[]`

Get all available configuration keys.

```typescript
console.log('Available config:', config.keys())
```

### `config.validate(requiredKeys: string[]): void`

Validate that all required keys are present. Throws `ConfigValidationError` if any are missing.

```typescript
// At app startup
try {
  config.validate(['API_URL', 'AUTH_SECRET', 'DATABASE_URL'])
} catch (error) {
  if (error instanceof ConfigValidationError) {
    console.error('Missing config:', error.missingKeys)
  }
}
```

## Platform Implementation Details

### Web (Vite)

Uses `import.meta.env` with automatic `VITE_` prefix handling:
- Your code: `config.get('API_URL')`
- Internal lookup: `import.meta.env.VITE_API_URL`

### React Native

Uses `react-native-config` for native environment variable injection:
- Your code: `config.get('API_URL')`
- Internal lookup: `Config.API_URL`

Make sure to follow [react-native-config setup](https://github.com/luggit/react-native-config#setup) for your platform.

## Best Practices

1. **Generate types after .env changes** - Run `idealyst-config generate` whenever you add/remove environment variables

2. **Validate at startup** - Call `config.validate()` early in your app to catch missing config

3. **Use .env.example** - Commit an example file with all required keys (no values)

4. **Don't commit secrets** - Add `.env` and `.env.local` to `.gitignore`

## License

MIT
