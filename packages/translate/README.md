# @idealyst/translate

Cross-platform internationalization for the Idealyst Framework, wrapping `react-i18next` with a unified API and a Babel plugin for static translation key analysis.

## Features

- **Unified API** - Single API for React and React Native
- **Babel Plugin** - Static extraction of translation keys at build time
- **Missing Translation Detection** - Automatically detect keys missing translations
- **Unused Translation Detection** - Find translations not used in code
- **JSON Report** - Generate detailed reports for CI/CD integration
- **Namespace Support** - Organize translations with nested namespaces

## Installation

```bash
npm install @idealyst/translate react-i18next i18next
# or
yarn add @idealyst/translate react-i18next i18next
```

## Quick Start

### 1. Set up the Provider

```tsx
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

### 2. Use Translations

```tsx
import { useTranslation, Trans } from '@idealyst/translate';

function MyComponent() {
  const { t, language } = useTranslation('common');

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('greeting', { name: 'World' })}</p>

      <Trans
        i18nKey="common.richText"
        components={{
          bold: <strong />,
          link: <a href="/help" />,
        }}
      />
    </div>
  );
}
```

### 3. Language Switching

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

## Babel Plugin

The Babel plugin extracts translation keys at build time and generates a report of missing/unused translations.

### Configuration

```javascript
// babel.config.js
module.exports = {
  plugins: [
    ['@idealyst/translate/plugin', {
      // Required: paths to translation JSON files
      translationFiles: ['./locales/**/*.json'],

      // Optional: output path for the report
      reportPath: '.idealyst/translations-report.json',

      // Optional: default namespace
      defaultNamespace: 'common',

      // Optional: emit console warnings
      emitWarnings: true,

      // Optional: fail build on missing translations
      failOnMissing: false,

      // Optional: verbose logging
      verbose: false,
    }],
  ],
};
```

### Report Output

The plugin generates a JSON report at `.idealyst/translations-report.json`:

```json
{
  "timestamp": "2026-01-08T12:00:00.000Z",
  "totalKeys": 45,
  "languages": ["en", "es"],
  "missing": {
    "es": [
      {
        "key": "common.buttons.submit",
        "namespace": "common",
        "usedIn": [
          { "file": "src/Form.tsx", "line": 42, "column": 12 }
        ]
      }
    ]
  },
  "unused": {
    "en": ["legacy.oldFeature"]
  },
  "summary": {
    "totalMissing": 1,
    "totalUnused": 1,
    "coveragePercent": { "en": 100, "es": 98 }
  }
}
```

## Translation File Format

### Directory Structure

```
locales/
├── en/
│   ├── common.json
│   └── auth.json
├── es/
│   ├── common.json
│   └── auth.json
└── fr/
    ├── common.json
    └── auth.json
```

### JSON Format

```json
{
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel"
  },
  "greeting": "Hello, {{name}}!",
  "items": "{{count}} item",
  "items_plural": "{{count}} items",
  "richText": "Click <bold>here</bold> for <link>help</link>"
}
```

## API Reference

### TranslateProvider

| Prop | Type | Description |
|------|------|-------------|
| `config` | `TranslateConfig` | Configuration object |
| `onInitialized` | `(i18n) => void` | Called when i18next is ready |
| `onLanguageChanged` | `(lang) => void` | Called when language changes |

### useTranslation

```typescript
const { t, language, languages, ready, i18n } = useTranslation(namespace?, options?);
```

### useLanguage

```typescript
const { language, languages, setLanguage, isSupported, getDisplayName } = useLanguage();
```

### Trans

```tsx
<Trans
  i18nKey="key"
  ns="namespace"
  components={{ bold: <strong /> }}
  values={{ name: 'World' }}
  count={5}
/>
```

## CI/CD Integration

Use the report in your CI pipeline:

```bash
# Check for missing translations
jq '.summary.totalMissing' .idealyst/translations-report.json

# Fail if coverage drops below threshold
jq -e '.summary.coveragePercent.es >= 95' .idealyst/translations-report.json
```

## License

MIT
