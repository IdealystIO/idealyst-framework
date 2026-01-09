# @idealyst/translate

Cross-platform internationalization for the Idealyst Framework. Wraps `react-i18next` with a unified API and includes a Babel plugin for static translation key analysis.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Translation Files](#translation-files)
- [Runtime API](#runtime-api)
- [Babel Plugin](#babel-plugin)
- [CI/CD Integration](#cicd-integration)
- [Platform-Specific Setup](#platform-specific-setup)
- [Advanced Usage](#advanced-usage)
- [API Reference](#api-reference)

## Features

- **Unified API** - Single API for React and React Native
- **Babel Plugin** - Static extraction of translation keys at build time
- **Missing Translation Detection** - Automatically detect keys missing translations
- **Unused Translation Detection** - Find translations not used in code
- **JSON Report** - Generate detailed reports for CI/CD integration
- **Namespace Support** - Organize translations with nested namespaces
- **Pluralization** - Full i18next pluralization support
- **Interpolation** - Variable interpolation in translations
- **Rich Text** - Component interpolation with the Trans component

## Installation

```bash
# npm
npm install @idealyst/translate react-i18next i18next

# yarn
yarn add @idealyst/translate react-i18next i18next

# pnpm
pnpm add @idealyst/translate react-i18next i18next
```

## Quick Start

### 1. Create Translation Files

```
locales/
├── en/
│   └── common.json
└── es/
    └── common.json
```

**locales/en/common.json**
```json
{
  "welcome": {
    "title": "Welcome to Our App",
    "greeting": "Hello, {{name}}!"
  },
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel"
  },
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}
```

**locales/es/common.json**
```json
{
  "welcome": {
    "title": "Bienvenido a Nuestra App",
    "greeting": "¡Hola, {{name}}!"
  },
  "buttons": {
    "submit": "Enviar",
    "cancel": "Cancelar"
  },
  "items": "{{count}} artículo",
  "items_plural": "{{count}} artículos"
}
```

### 2. Set Up the Provider

```tsx
// App.tsx
import { TranslateProvider } from '@idealyst/translate';
import en from './locales/en/common.json';
import es from './locales/es/common.json';

const config = {
  defaultLanguage: 'en',
  languages: ['en', 'es'],
  resources: {
    en: { common: en },
    es: { common: es },
  },
  defaultNamespace: 'common',
};

export function App() {
  return (
    <TranslateProvider config={config}>
      <MyApp />
    </TranslateProvider>
  );
}
```

### 3. Use Translations

```tsx
// MyComponent.tsx
import { useTranslation } from '@idealyst/translate';

function MyComponent() {
  const { t } = useTranslation('common');

  return (
    <div>
      {/* Simple translation */}
      <h1>{t('welcome.title')}</h1>

      {/* With interpolation */}
      <p>{t('welcome.greeting', { name: 'John' })}</p>

      {/* With pluralization */}
      <p>{t('items', { count: 5 })}</p>

      {/* Buttons */}
      <button>{t('buttons.submit')}</button>
      <button>{t('buttons.cancel')}</button>
    </div>
  );
}
```

### 4. Language Switching

```tsx
import { useLanguage } from '@idealyst/translate';

function LanguageSwitcher() {
  const { language, languages, setLanguage, getDisplayName } = useLanguage();

  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      {languages.map((lang) => (
        <option key={lang} value={lang}>
          {getDisplayName(lang)}
        </option>
      ))}
    </select>
  );
}
```

## Translation Files

### Directory Structure

Organize translations by language and namespace:

```
locales/
├── en/
│   ├── common.json      # Common UI strings
│   ├── auth.json        # Authentication strings
│   └── errors.json      # Error messages
├── es/
│   ├── common.json
│   ├── auth.json
│   └── errors.json
└── fr/
    ├── common.json
    ├── auth.json
    └── errors.json
```

### JSON Format

```json
{
  "namespace.key": "value",

  "nested": {
    "keys": {
      "work": "Like this"
    }
  },

  "interpolation": "Hello, {{name}}!",

  "plural": "{{count}} item",
  "plural_plural": "{{count}} items",

  "context_male": "He liked it",
  "context_female": "She liked it",

  "richText": "Read our <terms>Terms</terms> and <privacy>Privacy Policy</privacy>"
}
```

### Key Formats

The plugin supports two key formats:

```tsx
// Namespace:key format (i18next standard)
t('auth:login.title')

// Namespace.key format (first segment is namespace)
t('auth.login.title')

// Both resolve to:
// namespace: "auth"
// localKey: "login.title"
```

## Runtime API

### TranslateProvider

Wrap your app with the provider:

```tsx
import { TranslateProvider } from '@idealyst/translate';

<TranslateProvider
  config={{
    defaultLanguage: 'en',
    languages: ['en', 'es', 'fr'],
    resources: {
      en: { common: enCommon, auth: enAuth },
      es: { common: esCommon, auth: esAuth },
    },
    defaultNamespace: 'common',
    fallbackLanguage: 'en',
    debug: false,
  }}
  onInitialized={(i18n) => console.log('i18n ready')}
  onLanguageChanged={(lang) => console.log('Language:', lang)}
>
  <App />
</TranslateProvider>
```

### useTranslation Hook

```tsx
import { useTranslation } from '@idealyst/translate';

function Component() {
  const { t, language, languages, ready, i18n } = useTranslation('common');

  // Simple translation
  const title = t('welcome.title');

  // With interpolation
  const greeting = t('welcome.greeting', { name: 'World' });

  // With default value
  const fallback = t('missing.key', { defaultValue: 'Fallback text' });

  // With pluralization
  const items = t('items', { count: 5 });

  // With context
  const gendered = t('liked', { context: 'male' });

  return <div>{title}</div>;
}
```

### useLanguage Hook

```tsx
import { useLanguage } from '@idealyst/translate';

function LanguageControls() {
  const {
    language,        // Current language: 'en'
    languages,       // Available: ['en', 'es', 'fr']
    setLanguage,     // Change language
    isSupported,     // Check if language is available
    getDisplayName,  // Get display name: 'English', 'Español'
  } = useLanguage();

  const handleChange = async (newLang: string) => {
    if (isSupported(newLang)) {
      await setLanguage(newLang);
    }
  };

  return (
    <div>
      <p>Current: {getDisplayName(language)}</p>
      <button onClick={() => handleChange('es')}>Switch to Spanish</button>
    </div>
  );
}
```

### Trans Component

For rich text with embedded components:

```tsx
import { Trans } from '@idealyst/translate';

function RichText() {
  return (
    <Trans
      i18nKey="common.richText"
      components={{
        terms: <a href="/terms" />,
        privacy: <a href="/privacy" />,
        bold: <strong />,
      }}
      values={{ name: 'User' }}
    />
  );
}

// With translation:
// "richText": "Read our <terms>Terms</terms> and <privacy>Privacy Policy</privacy>, <bold>{{name}}</bold>!"
//
// Renders:
// Read our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>, <strong>User</strong>!
```

## Babel Plugin

The Babel plugin extracts translation keys at build time and generates a report of missing/unused translations.

### Configuration

**babel.config.js**
```javascript
module.exports = {
  presets: ['@babel/preset-react', '@babel/preset-typescript'],
  plugins: [
    ['@idealyst/translate/plugin', {
      // Required: paths to translation JSON files (supports glob)
      translationFiles: ['./locales/**/*.json'],

      // Optional: output path for the report
      reportPath: '.idealyst/translations-report.json',

      // Optional: default namespace when not specified in key
      defaultNamespace: 'common',

      // Optional: emit console warnings for missing translations
      emitWarnings: true,

      // Optional: fail build if missing translations found
      failOnMissing: false,

      // Optional: verbose logging
      verbose: false,
    }],
  ],
};
```

**For Vite (vite.config.ts)**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@idealyst/translate/plugin', {
            translationFiles: ['./locales/**/*.json'],
            reportPath: '.idealyst/translations-report.json',
            defaultNamespace: 'common',
          }],
        ],
      },
    }),
  ],
});
```

**For React Native (babel.config.js)**
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@idealyst/translate/plugin', {
      translationFiles: ['./locales/**/*.json'],
      reportPath: '.idealyst/translations-report.json',
      defaultNamespace: 'common',
      emitWarnings: true,
    }],
  ],
};
```

### What the Plugin Extracts

The plugin statically analyzes your code for:

```tsx
// t() function calls
t('common.key')
t('namespace:key')
t('key', { defaultValue: 'Default' })

// i18n.t() method calls
i18n.t('common.key')

// Trans component
<Trans i18nKey="common.richText" />
<Trans i18nKey={"common.richText"} />

// Dynamic keys are tracked but marked as such
const key = `common.${type}`;
t(key);  // Marked as isDynamic: true
```

### Report Output

The plugin generates `.idealyst/translations-report.json`:

```json
{
  "timestamp": "2026-01-08T12:00:00.000Z",
  "totalKeys": 45,
  "dynamicKeys": [
    {
      "key": "<dynamic>",
      "file": "src/DynamicComponent.tsx",
      "line": 15,
      "isDynamic": true
    }
  ],
  "extractedKeys": [
    {
      "key": "common.buttons.submit",
      "namespace": "common",
      "localKey": "buttons.submit",
      "file": "src/Form.tsx",
      "line": 42,
      "column": 12,
      "defaultValue": "Submit",
      "isDynamic": false
    }
  ],
  "languages": ["en", "es", "fr"],
  "missing": {
    "en": [],
    "es": [
      {
        "key": "common.buttons.submit",
        "namespace": "common",
        "usedIn": [
          { "file": "src/Form.tsx", "line": 42, "column": 12 }
        ],
        "defaultValue": "Submit"
      }
    ],
    "fr": []
  },
  "unused": {
    "en": ["common.legacy.oldFeature"],
    "es": [],
    "fr": []
  },
  "summary": {
    "totalMissing": 1,
    "totalUnused": 1,
    "coveragePercent": {
      "en": 100,
      "es": 98,
      "fr": 100
    }
  }
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Translation Check

on: [push, pull_request]

jobs:
  check-translations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: yarn install

      - name: Build (generates translation report)
        run: yarn build

      - name: Check for missing translations
        run: |
          MISSING=$(jq '.summary.totalMissing' .idealyst/translations-report.json)
          if [ "$MISSING" -gt 0 ]; then
            echo "Missing translations found: $MISSING"
            jq '.missing' .idealyst/translations-report.json
            exit 1
          fi

      - name: Check coverage threshold
        run: |
          jq -e '.summary.coveragePercent | to_entries | all(.value >= 95)' \
            .idealyst/translations-report.json || \
            (echo "Translation coverage below 95%" && exit 1)
```

### Shell Script

```bash
#!/bin/bash

# Build and generate report
yarn build

# Check for missing translations
MISSING=$(jq '.summary.totalMissing' .idealyst/translations-report.json)

if [ "$MISSING" -gt 0 ]; then
  echo "ERROR: $MISSING missing translation(s) found"
  echo ""
  echo "Missing translations:"
  jq -r '.missing | to_entries[] | select(.value | length > 0) | "\(.key): \(.value | length) missing"' \
    .idealyst/translations-report.json
  exit 1
fi

echo "All translations present!"
```

## Platform-Specific Setup

### React (Vite)

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@idealyst/translate/plugin', {
            translationFiles: ['./src/locales/**/*.json'],
            reportPath: '.idealyst/translations-report.json',
          }],
        ],
      },
    }),
  ],
});
```

### React Native

```javascript
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@idealyst/translate/plugin', {
      translationFiles: ['./src/locales/**/*.json'],
      reportPath: '.idealyst/translations-report.json',
    }],
  ],
};
```

### Next.js

```javascript
// next.config.js
module.exports = {
  // ... other config
};

// babel.config.js
module.exports = {
  presets: ['next/babel'],
  plugins: [
    ['@idealyst/translate/plugin', {
      translationFiles: ['./locales/**/*.json'],
      reportPath: '.idealyst/translations-report.json',
    }],
  ],
};
```

## Advanced Usage

### Multiple Namespaces

```tsx
// Load multiple namespaces
const { t } = useTranslation(['common', 'auth']);

// Use specific namespace
t('common:buttons.submit')
t('auth:login.title')
```

### Lazy Loading Namespaces

```tsx
import { useTranslation } from '@idealyst/translate';

function LazyComponent() {
  // Namespace loaded on demand
  const { t, ready } = useTranslation('largeNamespace');

  if (!ready) return <Loading />;

  return <div>{t('content')}</div>;
}
```

### Detecting Language from Browser/Device

```tsx
const config = {
  defaultLanguage: navigator.language.split('-')[0] || 'en',
  languages: ['en', 'es', 'fr'],
  // ...
};
```

### Persisting Language Preference

```tsx
import { useLanguage } from '@idealyst/translate';
import { useEffect } from 'react';

function LanguagePersistence() {
  const { language, setLanguage } = useLanguage();

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('language');
    if (saved) setLanguage(saved);
  }, []);

  // Save preference when changed
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return null;
}
```

## API Reference

### TranslateConfig

```typescript
interface TranslateConfig {
  /** Default language code */
  defaultLanguage: string;

  /** Supported language codes */
  languages: string[];

  /** Pre-loaded translation resources */
  resources?: Record<string, Record<string, object>>;

  /** Default namespace */
  defaultNamespace?: string;

  /** Fallback language when key missing */
  fallbackLanguage?: string;

  /** Enable debug logging */
  debug?: boolean;
}
```

### TranslatePluginOptions

```typescript
interface TranslatePluginOptions {
  /** Paths to translation files (glob patterns supported) */
  translationFiles: string[];

  /** Output path for report (default: '.idealyst/translations-report.json') */
  reportPath?: string;

  /** Languages to check (default: inferred from files) */
  languages?: string[];

  /** Default namespace (default: 'translation') */
  defaultNamespace?: string;

  /** Fail build on missing translations (default: false) */
  failOnMissing?: boolean;

  /** Emit console warnings (default: true) */
  emitWarnings?: boolean;

  /** Verbose logging (default: false) */
  verbose?: boolean;
}
```

### useTranslation Return Value

```typescript
interface UseTranslationResult {
  /** Translation function */
  t: (key: string, options?: TranslationOptions) => string;

  /** Current language code */
  language: string;

  /** All available languages */
  languages: string[];

  /** Whether translations are loaded */
  ready: boolean;

  /** i18next instance for advanced usage */
  i18n: i18n;
}
```

### useLanguage Return Value

```typescript
interface UseLanguageResult {
  /** Current language code */
  language: string;

  /** Available language codes */
  languages: string[];

  /** Change the current language */
  setLanguage: (lang: string) => Promise<void>;

  /** Check if a language is supported */
  isSupported: (lang: string) => boolean;

  /** Get display name for a language code */
  getDisplayName: (lang: string) => string;
}
```

## License

MIT
