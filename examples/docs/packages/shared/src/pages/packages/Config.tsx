import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function ConfigPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Config
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Cross-platform configuration management for React and React Native. Provides
          type-safe access to environment variables with validation, defaults, and
          CLI-generated TypeScript types.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          title="Import"
          code={`import { config } from '@idealyst/config';

// Get a config value
const apiUrl = config.get('API_URL');

// Get with default
const port = config.get('PORT', '3000');

// Get required (throws if missing)
const secret = config.getRequired('JWT_SECRET');

// Validate at startup
config.validate(['API_URL', 'JWT_SECRET']);`}
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          API Reference
        </Text>

        <View style={{ gap: 12, marginBottom: 32 }}>
          <MethodRow
            name="get(key, defaultValue?)"
            returns="string | undefined"
            description="Get a config value by key. Returns defaultValue if not set."
          />
          <MethodRow
            name="getRequired(key)"
            returns="string"
            description="Get a required config value. Throws if not defined."
          />
          <MethodRow
            name="has(key)"
            returns="boolean"
            description="Check if a config key exists."
          />
          <MethodRow
            name="keys()"
            returns="string[]"
            description="Get all available config keys."
          />
          <MethodRow
            name="validate(requiredKeys)"
            returns="void"
            description="Validate that all required keys are present. Throws ConfigValidationError if any are missing."
          />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Setup
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Config values come from different sources depending on platform:
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              Web (Vite)
            </Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Uses environment variables from .env files. Variables must be prefixed
              with VITE_ to be exposed to the client. The CLI strips this prefix
              for canonical access.
            </Text>
          </Card>
          <Card variant="outlined" style={{ padding: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 8 }}>
              React Native
            </Text>
            <Text typography="body2" color="tertiary" style={{ lineHeight: 22 }}>
              Uses react-native-config to load .env files at build time.
              Falls back to Babel plugin injection if react-native-config is not installed.
            </Text>
          </Card>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Web Setup
        </Text>

        <CodeBlock
          title=".env file"
          code={`# .env or .env.local
VITE_API_URL=https://api.example.com
VITE_APP_NAME=My App
VITE_FEATURE_FLAG=true`}
        />

        <CodeBlock
          title="Generate typed config"
          code={`# Run the CLI to generate TypeScript types
npx idealyst-config generate

# This creates:
# - src/config.generated.ts (config values)
# - src/config.generated.d.ts (type declarations)`}
        />

        <CodeBlock
          title="Initialize in app entry"
          code={`// App.tsx or main.tsx
import { setConfig } from '@idealyst/config';
import { generatedConfig } from './config.generated';

// Initialize config before using
setConfig(generatedConfig);

// Now use anywhere in your app
import { config } from '@idealyst/config';
const apiUrl = config.get('API_URL');`}
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Native Setup
        </Text>

        <CodeBlock
          title=".env file"
          code={`# .env
API_URL=https://api.example.com
APP_NAME=My App
FEATURE_FLAG=true`}
        />

        <CodeBlock
          title="Usage (automatic with react-native-config)"
          code={`// Config is automatically loaded from react-native-config
import { config } from '@idealyst/config';

// Values are available immediately
const apiUrl = config.get('API_URL');
const appName = config.getRequired('APP_NAME');`}
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Type-Safe Config
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Run the CLI to generate TypeScript types from your .env files for autocomplete:
        </Text>

        <CodeBlock
          title="CLI Usage"
          code={`# Basic usage - finds .env automatically
npx idealyst-config generate

# Specify env file
npx idealyst-config generate --env .env.production

# Specify output path
npx idealyst-config generate --output src/config.generated.ts

# Generate types only (no values)
npx idealyst-config generate --types-only

# Inherit from shared .env (monorepo)
npx idealyst-config generate --inherit ../shared/.env`}
        />

        <CodeBlock
          title="Generated Types"
          code={`// config.generated.d.ts (auto-generated)
declare module '@idealyst/config' {
  interface ConfigKeys {
    API_URL: string
    APP_NAME: string
    FEATURE_FLAG: string
  }

  interface IConfig {
    get<K extends keyof ConfigKeys>(key: K): string | undefined
    get<K extends keyof ConfigKeys>(key: K, defaultValue: string): string
    getRequired<K extends keyof ConfigKeys>(key: K): string
    has<K extends keyof ConfigKeys>(key: K): boolean
    validate(requiredKeys: (keyof ConfigKeys)[]): void
  }
}`}
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Validation
        </Text>

        <CodeBlock
          title="Startup Validation"
          code={`import { config, ConfigValidationError } from '@idealyst/config';

// Validate required keys at startup
try {
  config.validate([
    'API_URL',
    'JWT_SECRET',
    'DATABASE_URL',
  ]);
} catch (error) {
  if (error instanceof ConfigValidationError) {
    console.error('Missing config keys:', error.missingKeys);
    process.exit(1);
  }
  throw error;
}

// Now safe to use - all required keys are present
const apiUrl = config.getRequired('API_URL');`}
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Monorepo Support
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Config supports inheritance for monorepos with shared environment variables:
        </Text>

        <CodeBlock
          title="Monorepo Structure"
          code={`my-monorepo/
├── packages/
│   ├── shared/
│   │   └── .env              # Shared config (API_URL, etc.)
│   ├── web/
│   │   ├── .env              # Web-specific (VITE_GA_ID)
│   │   └── src/
│   │       └── config.generated.ts
│   └── mobile/
│       ├── .env              # Mobile-specific (BUNDLE_ID)
│       └── src/
│           └── config.generated.ts`}
        />

        <CodeBlock
          title="Generate with inheritance"
          code={`# In packages/web/
npx idealyst-config generate \\
  --env .env \\
  --inherit ../shared/.env \\
  --output src/config.generated.ts

# Shared values are merged with platform-specific values
# Platform-specific values override shared values`}
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Utility Functions
        </Text>

        <CodeBlock
          title="Config Utilities"
          code={`import {
  setConfig,
  clearConfig,
  getConfigStore,
} from '@idealyst/config';

// Manually set config values
setConfig({
  API_URL: 'https://api.example.com',
  DEBUG: 'true',
});

// Get all current config (for debugging)
console.log(getConfigStore());
// { API_URL: 'https://api.example.com', DEBUG: 'true' }

// Clear config (useful for testing)
clearConfig();`}
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Common Patterns
        </Text>

        <CodeBlock
          title="Feature Flags"
          code={`import { config } from '@idealyst/config';

// Feature flags as booleans
const isFeatureEnabled = config.get('FEATURE_X') === 'true';

// With helper
function getFlag(key: string): boolean {
  return config.get(key) === 'true';
}

if (getFlag('ENABLE_ANALYTICS')) {
  initAnalytics();
}`}
        />

        <CodeBlock
          title="Environment Detection"
          code={`import { config } from '@idealyst/config';

const isDev = config.get('NODE_ENV') === 'development';
const isProd = config.get('NODE_ENV') === 'production';

// API base URL with environment fallback
const apiUrl = config.get('API_URL',
  isDev ? 'http://localhost:3000' : 'https://api.prod.com'
);`}
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Error Handling
        </Text>

        <CodeBlock
          title="ConfigValidationError"
          code={`import { ConfigValidationError } from '@idealyst/config';

try {
  config.validate(['REQUIRED_KEY']);
} catch (error) {
  if (error instanceof ConfigValidationError) {
    // error.missingKeys: string[]
    console.error('Missing:', error.missingKeys.join(', '));
  }
}

// getRequired throws a standard Error
try {
  const secret = config.getRequired('MISSING_KEY');
} catch (error) {
  // Error: Required config key "MISSING_KEY" is not defined...
}`}
        />
      </View>
    </Screen>
  );
}

function MethodRow({
  name,
  returns,
  description,
}: {
  name: string;
  returns: string;
  description: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
      }}
    >
      <View style={{ width: 220 }}>
        <Text weight="semibold" style={{ fontFamily: 'monospace' }}>
          {name}
        </Text>
      </View>
      <View style={{ width: 140 }}>
        <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6366f1' }}>
          {returns}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text typography="body2" color="tertiary">
          {description}
        </Text>
      </View>
    </View>
  );
}
