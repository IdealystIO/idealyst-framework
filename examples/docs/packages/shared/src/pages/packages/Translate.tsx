import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function TranslatePage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Translate
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          Cross-platform internationalization (i18n) system built on i18next.
          Provides a unified API for translations with support for namespaces,
          pluralization, and rich text interpolation.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <CodeBlock
          code={`import {
  TranslateProvider,
  useTranslation,
  useLanguage,
  Trans
} from '@idealyst/translate';`}
          language="typescript"
          title="Import"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Setup
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Wrap your app with TranslateProvider and configure your languages and translations:
        </Text>

        <CodeBlock
          code={`import { TranslateProvider } from '@idealyst/translate';

// Import your translation files
import enCommon from './locales/en/common.json';
import esCommon from './locales/es/common.json';

const config = {
  defaultLanguage: 'en',
  languages: ['en', 'es'],
  defaultNamespace: 'common',
  resources: {
    en: { common: enCommon },
    es: { common: esCommon },
  },
};

export function App() {
  return (
    <TranslateProvider config={config}>
      <MyApp />
    </TranslateProvider>
  );
}`}
          language="tsx"
          title="App Setup"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Translation Files
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Create JSON files for each language with your translation keys:
        </Text>

        <CodeBlock
          code={`// locales/en/common.json
{
  "welcome": {
    "title": "Welcome",
    "message": "Hello, {{name}}!"
  },
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel"
  },
  "items": "{{count}} item",
  "items_plural": "{{count}} items"
}

// locales/es/common.json
{
  "welcome": {
    "title": "Bienvenido",
    "message": "Hola, {{name}}!"
  },
  "buttons": {
    "submit": "Enviar",
    "cancel": "Cancelar"
  },
  "items": "{{count}} artículo",
  "items_plural": "{{count}} artículos"
}`}
          language="json"
          title="Translation Files"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          useTranslation Hook
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          The primary hook for translating strings in your components:
        </Text>

        <CodeBlock
          code={`import { useTranslation } from '@idealyst/translate';

function MyComponent() {
  const { t, language, ready } = useTranslation('common');

  if (!ready) return <Loading />;

  return (
    <View>
      <Text>{t('welcome.title')}</Text>
      <Text>{t('welcome.message', { name: 'World' })}</Text>
      <Text>Current language: {language}</Text>
    </View>
  );
}`}
          language="tsx"
          title="Basic Usage"
        />

        <CodeBlock
          code={`// With key prefix - all keys are relative to the prefix
const { t } = useTranslation('common', { keyPrefix: 'buttons' });

// t('submit') is equivalent to t('buttons.submit')
<Button>{t('submit')}</Button>
<Button>{t('cancel')}</Button>`}
          language="tsx"
          title="Key Prefix"
        />

        <View style={{ gap: 16, marginTop: 24, marginBottom: 32 }}>
          <HookReturnCard
            name="t(key, options?)"
            description="Translation function. Accepts a key and optional interpolation values."
          />
          <HookReturnCard
            name="language"
            description="Current language code (e.g., 'en', 'es')."
          />
          <HookReturnCard
            name="languages"
            description="Array of all supported language codes."
          />
          <HookReturnCard
            name="ready"
            description="Boolean indicating if translations are loaded and ready."
          />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          useLanguage Hook
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Hook for managing the current language:
        </Text>

        <CodeBlock
          code={`import { useLanguage } from '@idealyst/translate';

function LanguageSwitcher() {
  const { language, languages, setLanguage, getDisplayName } = useLanguage();

  return (
    <View>
      {languages.map((lang) => (
        <Button
          key={lang}
          intent={language === lang ? 'primary' : 'secondary'}
          onPress={() => setLanguage(lang)}
        >
          {getDisplayName(lang)} {/* "English", "Español", etc. */}
        </Button>
      ))}
    </View>
  );
}`}
          language="tsx"
          title="Language Switcher"
        />

        <View style={{ gap: 16, marginTop: 24, marginBottom: 32 }}>
          <HookReturnCard
            name="language"
            description="Current language code."
          />
          <HookReturnCard
            name="languages"
            description="Array of all supported language codes."
          />
          <HookReturnCard
            name="setLanguage(lang)"
            description="Async function to change the current language."
          />
          <HookReturnCard
            name="isSupported(lang)"
            description="Returns true if the language is in the supported list."
          />
          <HookReturnCard
            name="getDisplayName(lang, inLanguage?)"
            description="Returns the display name of a language (uses Intl.DisplayNames)."
          />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Trans Component
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          For rich text translations with embedded components:
        </Text>

        <CodeBlock
          code={`import { Trans } from '@idealyst/translate';

// Translation: "Click <bold>here</bold> for <link>help</link>"
<Trans
  i18nKey="helpText"
  components={{
    bold: <Text weight="bold" />,
    link: <Link href="/help" />,
  }}
/>

// Translation: "You have {{count}} message" / "You have {{count}} messages"
<Trans i18nKey="messageCount" count={unreadCount} />

// Translation: "Read <0>terms</0> and <1>privacy</1>"
<Trans i18nKey="legal">
  <Link href="/terms">terms</Link>
  <Link href="/privacy">privacy</Link>
</Trans>`}
          language="tsx"
          title="Rich Text Translations"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Pluralization
        </Text>

        <Text typography="body2" color="secondary" style={{ marginBottom: 16, lineHeight: 24 }}>
          Handle singular and plural forms automatically:
        </Text>

        <CodeBlock
          code={`// Translation file
{
  "items": "{{count}} item",
  "items_plural": "{{count}} items",
  "items_0": "No items"
}

// Usage
const { t } = useTranslation();

t('items', { count: 0 });  // "No items"
t('items', { count: 1 });  // "1 item"
t('items', { count: 5 });  // "5 items"`}
          language="tsx"
          title="Pluralization"
        />

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12, marginTop: 32 }}>
          Configuration Options
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <ConfigCard
            name="defaultLanguage"
            type="string"
            description="The default language code to use (e.g., 'en')."
            required
          />
          <ConfigCard
            name="languages"
            type="string[]"
            description="Array of supported language codes."
            required
          />
          <ConfigCard
            name="resources"
            type="Resource"
            description="Pre-loaded translation resources keyed by language and namespace."
          />
          <ConfigCard
            name="defaultNamespace"
            type="string"
            description="Default namespace when none is specified. Defaults to 'translation'."
          />
          <ConfigCard
            name="fallbackLanguage"
            type="string"
            description="Language to fall back to when a translation is missing."
          />
          <ConfigCard
            name="debug"
            type="boolean"
            description="Enable i18next debug mode. Defaults to false."
          />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Provider Callbacks
        </Text>

        <CodeBlock
          code={`<TranslateProvider
  config={config}
  onInitialized={(i18n) => {
    console.log('Translations ready');
  }}
  onLanguageChanged={(lang) => {
    console.log('Language changed to:', lang);
    // Persist preference, update analytics, etc.
  }}
>
  <App />
</TranslateProvider>`}
          language="tsx"
          title="Event Callbacks"
        />
      </View>
    </Screen>
  );
}

function HookReturnCard({ name, description }: { name: string; description: string }) {
  return (
    <Card variant="outlined" style={{ padding: 16 }}>
      <Text weight="semibold" style={{ fontFamily: 'monospace', marginBottom: 4 }}>
        {name}
      </Text>
      <Text typography="body2" color="tertiary">
        {description}
      </Text>
    </Card>
  );
}

function ConfigCard({
  name,
  type,
  description,
  required,
}: {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}) {
  return (
    <Card variant="outlined" style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Text weight="semibold">{name}</Text>
        <Text typography="caption" style={{ fontFamily: 'monospace', color: '#6366f1' }}>
          {type}
        </Text>
        {required && (
          <Text typography="caption" color="danger">
            required
          </Text>
        )}
      </View>
      <Text typography="body2" color="tertiary">
        {description}
      </Text>
    </Card>
  );
}
