import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { useTranslation } from '@idealyst/translate';
import { CodeBlock } from '../../components/CodeBlock';

export function ThemeOverviewPage() {
  const { t } = useTranslation('theme');

  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          {t('overview.title')}
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          {t('overview.description')}
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          {t('overview.architecture.title')}
        </Text>

        <View background="inverse" style={{ padding: 20, marginBottom: 24, borderRadius: 8 }}>
          <Text
            typography="body2"
            color="inverse"
            style={{ fontFamily: 'monospace', lineHeight: 24 }}
          >
{`┌─────────────────────────────────────────────────────┐
│  Theme Layer (builder.ts)                           │
│  createTheme() → addIntent() → setSizes() → build() │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│  Style Layer (styleBuilder.ts)                      │
│  defineStyle() / extendStyle() / overrideStyle()    │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│  Babel Plugin (babel/plugin.js)                     │
│  Transforms → StyleSheet.create(), expands $iter    │
└─────────────────────────────────────────────────────┘`}
          </Text>
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          {t('overview.coreConcepts.title')}
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <ConceptCard
            title={t('overview.coreConcepts.themeBuilder.title')}
            description={t('overview.coreConcepts.themeBuilder.description')}
          />
          <ConceptCard
            title={t('overview.coreConcepts.styleDefinition.title')}
            description={t('overview.coreConcepts.styleDefinition.description')}
          />
          <ConceptCard
            title={t('overview.coreConcepts.styleExtensions.title')}
            description={t('overview.coreConcepts.styleExtensions.description')}
          />
          <ConceptCard
            title={t('overview.coreConcepts.iteratorPattern.title')}
            description={t('overview.coreConcepts.iteratorPattern.description')}
          />
        </View>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          {t('overview.quickExample.title')}
        </Text>

        <CodeBlock
          code={`import { createTheme } from '@idealyst/theme';

export const myTheme = createTheme()
  .addIntent('primary', {
    primary: '#3b82f6',
    contrast: '#ffffff',
    light: '#bfdbfe',
    dark: '#1e40af',
  })
  .addIntent('success', {
    primary: '#22c55e',
    contrast: '#ffffff',
    light: '#a7f3d0',
    dark: '#165e29',
  })
  .addRadius('sm', 4)
  .addRadius('md', 8)
  .addRadius('lg', 12)
  .setSizes({
    button: {
      xs: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 12 },
      sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 14 },
      md: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 16 },
      // ...
    },
  })
  .build();`}
          language="typescript"
          title={t('overview.quickExample.codeTitle')}
        />
      </View>
    </Screen>
  );
}

function ConceptCard({ title, description }: { title: string; description: string }) {
  return (
    <Card variant="outlined" style={{ padding: 16 }}>
      <Text weight="semibold" style={{ marginBottom: 4 }}>
        {title}
      </Text>
      <Text typography="body2" color="tertiary">
        {description}
      </Text>
    </Card>
  );
}
