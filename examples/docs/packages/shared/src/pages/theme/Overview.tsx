import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function ThemeOverviewPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text size="xl" weight="bold" style={{ marginBottom: 16 }}>
          Theme System Overview
        </Text>

        <Text style={{ marginBottom: 24, lineHeight: 26, color: '#333333' }}>
          Idealyst provides a powerful theming system built on react-native-unistyles.
          Themes are created using a fluent builder API with full TypeScript inference.
        </Text>

        <Text weight="semibold" size="lg" style={{ marginBottom: 12 }}>
          Architecture
        </Text>

        <Card variant="outlined" style={{ padding: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              lineHeight: 24,
              color: '#333333',
            }}
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
        </Card>

        <Text weight="semibold" size="lg" style={{ marginBottom: 12 }}>
          Core Concepts
        </Text>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <ConceptCard
            title="Theme Builder"
            description="Create themes using a fluent builder pattern. Define intents, radii, shadows, colors, and component sizes."
          />
          <ConceptCard
            title="Style Definition"
            description="Use defineStyle() to create component styles with theme reactivity and variant support."
          />
          <ConceptCard
            title="Style Extensions"
            description="Customize component styles using extendStyle() or overrideStyle() without modifying source code."
          />
          <ConceptCard
            title="$iterator Pattern"
            description="Define styles once that automatically expand to all keys of a theme object (intents, sizes, etc.)"
          />
        </View>

        <Text weight="semibold" size="lg" style={{ marginBottom: 12 }}>
          Quick Example
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
          title="Creating a Theme"
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
      <Text size="sm" style={{ color: '#666666' }}>
        {description}
      </Text>
    </Card>
  );
}
