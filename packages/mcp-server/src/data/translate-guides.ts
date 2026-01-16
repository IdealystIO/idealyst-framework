export const translateGuides: Record<string, string> = {
  "idealyst://translate/overview": `# @idealyst/translate Overview

Cross-platform internationalization for the Idealyst Framework. Wraps \`react-i18next\` with a unified API and includes a Babel plugin for static translation key analysis.

## Core Features

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

\`\`\`bash
yarn add @idealyst/translate react-i18next i18next
\`\`\`

## Quick Start

### 1. Create Translation Files

\`\`\`
locales/
├── en/
│   └── common.json
└── es/
    └── common.json
\`\`\`

**locales/en/common.json**
\`\`\`json
{
  "welcome": {
    "title": "Welcome to Our App",
    "greeting": "Hello, {{name}}!"
  },
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel"
  }
}
\`\`\`

### 2. Set Up the Provider

\`\`\`tsx
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
\`\`\`

### 3. Use Translations

\`\`\`tsx
import { useTranslation } from '@idealyst/translate';

function MyComponent() {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.greeting', { name: 'John' })}</p>
      <button>{t('buttons.submit')}</button>
    </div>
  );
}
\`\`\`

## Key Concepts

### Key Formats
The package supports two key formats:

\`\`\`tsx
// Namespace:key format (i18next standard)
t('auth:login.title')

// Namespace.key format (first segment is namespace)
t('auth.login.title')
\`\`\`

### Namespace Organization
Organize translations by domain:
- \`common.json\` - Shared UI strings
- \`auth.json\` - Authentication strings
- \`errors.json\` - Error messages
- \`forms.json\` - Form labels and validation
`,

  "idealyst://translate/runtime-api": `# Runtime API Reference

Complete reference for the @idealyst/translate runtime API.

## TranslateProvider

Wrap your app with the provider to enable translations:

\`\`\`tsx
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
\`\`\`

### TranslateConfig Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| \`defaultLanguage\` | string | Yes | Default language code |
| \`languages\` | string[] | Yes | Supported language codes |
| \`resources\` | object | No | Pre-loaded translation resources |
| \`defaultNamespace\` | string | No | Default namespace (default: 'translation') |
| \`fallbackLanguage\` | string | No | Fallback when key missing |
| \`debug\` | boolean | No | Enable debug logging |

## useTranslation Hook

The main hook for accessing translations:

\`\`\`tsx
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
\`\`\`

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| \`t\` | function | Translation function |
| \`language\` | string | Current language code |
| \`languages\` | string[] | All available languages |
| \`ready\` | boolean | Whether translations are loaded |
| \`i18n\` | i18n | i18next instance for advanced usage |

### Translation Options

\`\`\`tsx
t('key', {
  // Default value if key not found
  defaultValue: 'Fallback',

  // Interpolation values
  name: 'John',
  count: 5,

  // Pluralization count
  count: 3,

  // Context for contextual translations
  context: 'male',
});
\`\`\`

## useLanguage Hook

For language management:

\`\`\`tsx
import { useLanguage } from '@idealyst/translate';

function LanguageControls() {
  const {
    language,        // Current: 'en'
    languages,       // Available: ['en', 'es', 'fr']
    setLanguage,     // Change language
    isSupported,     // Check availability
    getDisplayName,  // Get 'English', 'Español'
  } = useLanguage();

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
\`\`\`

## Trans Component

For rich text with embedded components:

\`\`\`tsx
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

// Translation:
// "richText": "Read our <terms>Terms</terms> and <privacy>Privacy Policy</privacy>"
//
// Renders:
// Read our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
\`\`\`

### Trans Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \`i18nKey\` | string | Yes | Translation key |
| \`ns\` | string | No | Namespace |
| \`components\` | object | No | Component interpolations |
| \`values\` | object | No | Value interpolations |
| \`count\` | number | No | Pluralization count |
`,

  "idealyst://translate/babel-plugin": `# Babel Plugin Reference

The Babel plugin extracts translation keys at build time and generates reports of missing/unused translations.

## Installation

The plugin is included with @idealyst/translate. Just configure it in your Babel config.

## Configuration

### babel.config.js

\`\`\`javascript
module.exports = {
  presets: ['@babel/preset-react', '@babel/preset-typescript'],
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
\`\`\`

### Vite Configuration

\`\`\`typescript
// vite.config.ts
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
\`\`\`

### React Native Configuration

\`\`\`javascript
// babel.config.js
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
\`\`\`

## Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| \`translationFiles\` | string[] | Required | Glob patterns for translation files |
| \`reportPath\` | string | '.idealyst/translations-report.json' | Output path for report |
| \`languages\` | string[] | Auto-detected | Languages to check |
| \`defaultNamespace\` | string | 'translation' | Default namespace |
| \`failOnMissing\` | boolean | false | Fail build if missing |
| \`emitWarnings\` | boolean | true | Console warnings |
| \`verbose\` | boolean | false | Verbose logging |

## What Gets Extracted

The plugin statically analyzes your code for:

\`\`\`tsx
// t() function calls
t('common.key')
t('namespace:key')
t('key', { defaultValue: 'Default' })

// i18n.t() method calls
i18n.t('common.key')

// Trans component
<Trans i18nKey="common.richText" />
<Trans i18nKey={"common.richText"} />

// Dynamic keys (tracked but marked as dynamic)
const key = \`common.\${type}\`;
t(key);  // Marked as isDynamic: true
\`\`\`

## Report Structure

The plugin generates a JSON report:

\`\`\`json
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
    ]
  },
  "unused": {
    "en": ["common.legacy.oldFeature"]
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
\`\`\`

## CI/CD Integration

### GitHub Actions

\`\`\`yaml
name: Translation Check

on: [push, pull_request]

jobs:
  check-translations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: yarn install
      - run: yarn build
      - name: Check missing translations
        run: |
          MISSING=$(jq '.summary.totalMissing' .idealyst/translations-report.json)
          if [ "$MISSING" -gt 0 ]; then
            echo "Missing translations: $MISSING"
            jq '.missing' .idealyst/translations-report.json
            exit 1
          fi
\`\`\`

### Shell Script

\`\`\`bash
#!/bin/bash
yarn build

MISSING=$(jq '.summary.totalMissing' .idealyst/translations-report.json)

if [ "$MISSING" -gt 0 ]; then
  echo "ERROR: $MISSING missing translation(s)"
  jq -r '.missing | to_entries[] | select(.value | length > 0) | "\\(.key): \\(.value | length) missing"' \\
    .idealyst/translations-report.json
  exit 1
fi

echo "All translations present!"
\`\`\`
`,

  "idealyst://translate/translation-files": `# Translation File Format

Guide to organizing and formatting translation files for @idealyst/translate.

## Directory Structure

Organize translations by language and namespace:

\`\`\`
locales/
├── en/
│   ├── common.json      # Common UI strings
│   ├── auth.json        # Authentication strings
│   ├── errors.json      # Error messages
│   └── forms.json       # Form labels
├── es/
│   ├── common.json
│   ├── auth.json
│   ├── errors.json
│   └── forms.json
└── fr/
    ├── common.json
    ├── auth.json
    ├── errors.json
    └── forms.json
\`\`\`

## JSON Format

### Basic Structure

\`\`\`json
{
  "simple": "Simple text",

  "nested": {
    "keys": {
      "work": "Like this"
    }
  }
}
\`\`\`

### Interpolation

Use \`{{variable}}\` for dynamic values:

\`\`\`json
{
  "greeting": "Hello, {{name}}!",
  "welcome": "Welcome back, {{user}}. You have {{count}} messages."
}
\`\`\`

Usage:
\`\`\`tsx
t('greeting', { name: 'John' })  // "Hello, John!"
t('welcome', { user: 'Alice', count: 5 })  // "Welcome back, Alice. You have 5 messages."
\`\`\`

### Pluralization

Add \`_plural\` suffix for plural forms:

\`\`\`json
{
  "item": "{{count}} item",
  "item_plural": "{{count}} items",

  "message": "You have {{count}} new message",
  "message_plural": "You have {{count}} new messages"
}
\`\`\`

Usage:
\`\`\`tsx
t('item', { count: 1 })  // "1 item"
t('item', { count: 5 })  // "5 items"
\`\`\`

### Context

Add \`_context\` suffix for contextual variations:

\`\`\`json
{
  "friend": "A friend",
  "friend_male": "A boyfriend",
  "friend_female": "A girlfriend"
}
\`\`\`

Usage:
\`\`\`tsx
t('friend')                    // "A friend"
t('friend', { context: 'male' })    // "A boyfriend"
t('friend', { context: 'female' })  // "A girlfriend"
\`\`\`

### Rich Text (Trans Component)

Use HTML-like tags for component interpolation:

\`\`\`json
{
  "terms": "By signing up, you agree to our <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>.",
  "welcome": "Welcome, <bold>{{name}}</bold>! Click <link>here</link> to continue."
}
\`\`\`

Usage:
\`\`\`tsx
<Trans
  i18nKey="common.terms"
  components={{
    terms: <a href="/terms" />,
    privacy: <a href="/privacy" />,
  }}
/>
\`\`\`

## Namespace Organization

### common.json - Shared UI
\`\`\`json
{
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit"
  },
  "labels": {
    "loading": "Loading...",
    "danger": "An error occurred",
    "success": "Success!"
  }
}
\`\`\`

### auth.json - Authentication
\`\`\`json
{
  "login": {
    "title": "Sign In",
    "email": "Email",
    "password": "Password",
    "submit": "Sign In",
    "forgotPassword": "Forgot password?"
  },
  "register": {
    "title": "Create Account",
    "submit": "Sign Up"
  },
  "errors": {
    "invalidCredentials": "Invalid email or password",
    "emailTaken": "Email is already registered"
  }
}
\`\`\`

### errors.json - Error Messages
\`\`\`json
{
  "network": {
    "offline": "You are offline. Please check your connection.",
    "timeout": "Request timed out. Please try again."
  },
  "validation": {
    "required": "This field is required",
    "email": "Please enter a valid email",
    "minLength": "Must be at least {{min}} characters"
  },
  "http": {
    "400": "Bad request",
    "401": "Unauthorized",
    "403": "Forbidden",
    "404": "Not found",
    "500": "Server error"
  }
}
\`\`\`

## Best Practices

### 1. Use Descriptive Keys
\`\`\`json
// Good
{
  "userProfile": {
    "editButton": "Edit Profile",
    "saveSuccess": "Profile saved successfully"
  }
}

// Avoid
{
  "btn1": "Edit Profile",
  "msg1": "Profile saved successfully"
}
\`\`\`

### 2. Group Related Translations
\`\`\`json
{
  "checkout": {
    "title": "Checkout",
    "steps": {
      "shipping": "Shipping",
      "payment": "Payment",
      "review": "Review"
    },
    "buttons": {
      "next": "Continue",
      "back": "Go Back",
      "placeOrder": "Place Order"
    }
  }
}
\`\`\`

### 3. Keep Keys Consistent Across Languages
All language files should have the same key structure:

\`\`\`json
// en/common.json
{ "greeting": "Hello" }

// es/common.json
{ "greeting": "Hola" }

// fr/common.json
{ "greeting": "Bonjour" }
\`\`\`

### 4. Add Comments with Default Values
The Babel plugin extracts \`defaultValue\` for documentation:

\`\`\`tsx
t('newFeature.title', { defaultValue: 'New Feature' })
\`\`\`

This appears in the report and helps translators understand context.
`,

  "idealyst://translate/examples": `# Translation Examples

Complete code examples for common @idealyst/translate patterns.

## Basic App Setup

\`\`\`tsx
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
      <Navigation />
    </TranslateProvider>
  );
}
\`\`\`

## Component with Translations

\`\`\`tsx
// components/WelcomeScreen.tsx
import { View, Text, Button } from '@idealyst/components';
import { useTranslation } from '@idealyst/translate';

export function WelcomeScreen() {
  const { t } = useTranslation('common');

  return (
    <View>
      <Text variant="h1">{t('welcome.title')}</Text>
      <Text>{t('welcome.subtitle')}</Text>
      <Button onPress={() => {}}>
        {t('buttons.getStarted')}
      </Button>
    </View>
  );
}
\`\`\`

## Language Switcher Component

\`\`\`tsx
// components/LanguageSwitcher.tsx
import { Select } from '@idealyst/components';
import { useLanguage } from '@idealyst/translate';

export function LanguageSwitcher() {
  const { language, languages, setLanguage, getDisplayName } = useLanguage();

  const options = languages.map((lang) => ({
    value: lang,
    label: getDisplayName(lang),
  }));

  return (
    <Select
      value={language}
      options={options}
      onChange={(value) => setLanguage(value)}
      label="Language"
    />
  );
}
\`\`\`

## Form with Validation Messages

\`\`\`tsx
// components/LoginForm.tsx
import { View, Input, Button, Text } from '@idealyst/components';
import { useTranslation } from '@idealyst/translate';
import { useState } from 'react';

export function LoginForm() {
  const { t } = useTranslation('auth');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      // ... login logic
    } catch (e) {
      setError(t('errors.invalidCredentials'));
    }
  };

  return (
    <View>
      <Text variant="h2">{t('login.title')}</Text>

      <Input
        label={t('login.email')}
        placeholder={t('login.emailPlaceholder')}
        keyboardType="email-address"
      />

      <Input
        label={t('login.password')}
        placeholder={t('login.passwordPlaceholder')}
        secureTextEntry
      />

      {error && <Text intent="danger">{error}</Text>}

      <Button onPress={handleSubmit}>
        {t('login.submit')}
      </Button>
    </View>
  );
}
\`\`\`

## Pluralization Example

\`\`\`tsx
// components/NotificationBadge.tsx
import { Badge } from '@idealyst/components';
import { useTranslation } from '@idealyst/translate';

interface Props {
  count: number;
}

export function NotificationBadge({ count }: Props) {
  const { t } = useTranslation('common');

  if (count === 0) return null;

  return (
    <Badge intent="primary">
      {t('notifications.count', { count })}
    </Badge>
  );
}

// Translation file:
// {
//   "notifications": {
//     "count": "{{count}} notification",
//     "count_plural": "{{count}} notifications"
//   }
// }
\`\`\`

## Rich Text with Trans Component

\`\`\`tsx
// components/TermsAgreement.tsx
import { View, Text, Checkbox } from '@idealyst/components';
import { Trans, useTranslation } from '@idealyst/translate';
import { Link } from '@idealyst/navigation';
import { useState } from 'react';

export function TermsAgreement() {
  const { t } = useTranslation('auth');
  const [agreed, setAgreed] = useState(false);

  return (
    <View>
      <Checkbox
        checked={agreed}
        onChange={setAgreed}
        label={
          <Trans
            i18nKey="auth.termsAgreement"
            components={{
              terms: <Link to="/terms" />,
              privacy: <Link to="/privacy" />,
            }}
          />
        }
      />
    </View>
  );
}

// Translation file:
// {
//   "termsAgreement": "I agree to the <terms>Terms of Service</terms> and <privacy>Privacy Policy</privacy>"
// }
\`\`\`

## Persisting Language Preference

\`\`\`tsx
// hooks/usePersistedLanguage.ts
import { useLanguage } from '@idealyst/translate';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@app/language';

export function usePersistedLanguage() {
  const { language, setLanguage } = useLanguage();

  // Load saved language on mount
  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((saved) => {
      if (saved) setLanguage(saved);
    });
  }, []);

  // Save language when changed
  useEffect(() => {
    AsyncStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  return { language, setLanguage };
}
\`\`\`

## Multiple Namespaces

\`\`\`tsx
// components/UserProfile.tsx
import { useTranslation } from '@idealyst/translate';

export function UserProfile() {
  // Load multiple namespaces
  const { t } = useTranslation(['common', 'user']);

  return (
    <View>
      {/* Use namespace prefix */}
      <Text variant="h1">{t('user:profile.title')}</Text>
      <Button>{t('common:buttons.edit')}</Button>
    </View>
  );
}
\`\`\`

## Date and Number Formatting

\`\`\`tsx
// components/OrderSummary.tsx
import { View, Text } from '@idealyst/components';
import { useTranslation, useLanguage } from '@idealyst/translate';

interface Props {
  total: number;
  orderDate: Date;
}

export function OrderSummary({ total, orderDate }: Props) {
  const { t } = useTranslation('orders');
  const { language } = useLanguage();

  // Format based on current language
  const formattedTotal = new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'USD',
  }).format(total);

  const formattedDate = new Intl.DateTimeFormat(language, {
    dateStyle: 'long',
  }).format(orderDate);

  return (
    <View>
      <Text>{t('summary.total', { amount: formattedTotal })}</Text>
      <Text>{t('summary.date', { date: formattedDate })}</Text>
    </View>
  );
}

// Translation file:
// {
//   "summary": {
//     "total": "Total: {{amount}}",
//     "date": "Order placed on {{date}}"
//   }
// }
\`\`\`
`,
};
