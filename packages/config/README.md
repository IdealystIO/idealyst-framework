# @idealyst/config

Cross-platform configuration for React and React Native with env inheritance support.

## Features

- **Single API** - Same code works on web and native
- **Env inheritance** - Shared config with platform-specific overrides
- **Babel plugin** - Config injected at build time, no runtime overhead
- **Type-safe** - Auto-generated TypeScript declarations
- **Monorepo friendly** - Designed for shared/web/mobile patterns

## Installation

```bash
npm install @idealyst/config

# For React Native, also install react-native-config
npm install react-native-config
cd ios && pod install
```

## Quick Start

### 1. Create your .env files

```
my-app/
├── packages/
│   ├── shared/
│   │   └── .env          # Base config (lowest priority)
│   ├── web/
│   │   └── .env          # Web overrides
│   └── mobile/
│       └── .env          # Mobile overrides
```

**shared/.env:**
```bash
API_URL=https://api.example.com
GOOGLE_CLIENT_ID=abc123
ANALYTICS_ENABLED=true
```

**web/.env:**
```bash
# Override API for web
API_URL=https://web-api.example.com
```

**mobile/.env:**
```bash
# Mobile uses shared API_URL, but different analytics
ANALYTICS_ENABLED=false
```

### 2. Add Babel plugin

**babel.config.js:**
```js
module.exports = {
  presets: ['...'],
  plugins: [
    ['@idealyst/config/plugin', {
      extends: ['../shared/.env'],
      envPath: '.env'
    }]
  ]
}
```

### 3. Use in your app

```typescript
import { config } from '@idealyst/config'

// Values are injected at build time!
const apiUrl = config.get('API_URL')
const analyticsEnabled = config.get('ANALYTICS_ENABLED') === 'true'
```

That's it! The Babel plugin reads your .env files at compile time and injects the values automatically.

## Babel Plugin Options

```js
['@idealyst/config/plugin', {
  // Inherit from these .env files (lowest to highest priority)
  extends: ['../shared/.env', '../common/.env'],

  // Main .env file (highest priority, default: auto-detect)
  envPath: '.env',

  // Project root (default: process.cwd())
  root: '/path/to/project'
}]
```

### Auto-detection

If you don't specify options, the plugin will:
1. Auto-detect `.env.local`, `.env.development`, or `.env` in your project
2. Auto-detect `../shared/.env` or `../../shared/.env` for inheritance

```js
// Minimal config - auto-detects everything
plugins: [
  '@idealyst/config/plugin'
]
```

## Inheritance Priority

Configs are merged in order, with later files overriding earlier ones:

```
1. extends[0]: ../shared/.env     (lowest priority)
2. extends[1]: ../common/.env
3. envPath: .env                  (highest priority)
```

## Vite Setup

For Vite projects, add to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@idealyst/config/plugin', {
            extends: ['../shared/.env'],
            envPath: '.env'
          }]
        ]
      }
    })
  ]
})
```

## React Native / Metro Setup

Add to `babel.config.js`:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@idealyst/config/plugin', {
      extends: ['../shared/.env'],
      envPath: '.env'
    }]
  ]
}
```

## API Reference

### `config.get(key: string): string | undefined`

Get a config value.

```typescript
const apiUrl = config.get('API_URL')
```

### `config.get(key: string, defaultValue: string): string`

Get with fallback default.

```typescript
const port = config.get('PORT', '3000')
```

### `config.getRequired(key: string): string`

Get required value. Throws if not defined.

```typescript
const secret = config.getRequired('JWT_SECRET')
```

### `config.has(key: string): boolean`

Check if key exists.

```typescript
if (config.has('DEBUG')) {
  enableDebugMode()
}
```

### `config.validate(requiredKeys: string[]): void`

Validate required keys at startup.

```typescript
config.validate(['API_URL', 'AUTH_SECRET'])
// Throws ConfigValidationError if any are missing
```

## Type Generation (Optional)

For TypeScript autocomplete, generate type declarations:

```bash
npx idealyst-config generate --extends ../shared/.env --env .env --types-only
```

This creates `src/config.generated.d.ts`:

```typescript
declare module '@idealyst/config' {
  interface ConfigKeys {
    API_URL: string
    GOOGLE_CLIENT_ID: string
    ANALYTICS_ENABLED: string
  }
}
```

Add to your build script for automatic updates:

```json
{
  "scripts": {
    "prebuild": "idealyst-config generate --extends ../shared/.env --types-only"
  }
}
```

## How It Works

The Babel plugin transforms your code at compile time:

**Input:**
```typescript
import { config } from '@idealyst/config'

const apiUrl = config.get('API_URL')
```

**Output (after Babel):**
```typescript
import { config, setConfig as __idealyst_setConfig } from '@idealyst/config'
__idealyst_setConfig({ API_URL: "https://api.example.com", GOOGLE_CLIENT_ID: "abc123" })

const apiUrl = config.get('API_URL')
```

This means:
- **No runtime .env parsing** - values are baked in at build time
- **Works with any bundler** - Vite, Webpack, Metro, esbuild
- **Tree-shakeable** - unused config keys can be eliminated
- **Secure** - .env files never shipped to client

## Best Practices

1. **Gitignore .env files** - Never commit secrets
2. **Commit .env.example** - Document required keys
3. **Use shared config** - DRY principle for common values
4. **Validate at startup** - Catch missing config early

## License

MIT
