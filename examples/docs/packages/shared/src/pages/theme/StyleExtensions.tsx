import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function StyleExtensionsPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text size="xl" weight="bold" style={{ marginBottom: 16 }}>
          Style Extensions
        </Text>

        <Text style={{ marginBottom: 32, lineHeight: 26, color: '#333333' }}>
          Idealyst allows you to customize component styles without modifying the source code.
          Use <Text weight="semibold">extendStyle()</Text> to merge additional styles with the base,
          or <Text weight="semibold">overrideStyle()</Text> to completely replace styles.
        </Text>

        <Text weight="semibold" size="lg" style={{ marginBottom: 12 }}>
          extendStyle()
        </Text>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          Merges your custom styles with the existing component styles. Base styles are preserved
          and your additions are applied on top.
        </Text>

        <CodeBlock title="Extending Button Styles">
{`import { extendStyle } from '@idealyst/theme';
import { buttonStyles } from '@idealyst/components';

// Merge custom styles with base Button styles
extendStyle(buttonStyles, (theme) => ({
  button: {
    // Add a shadow to all buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    // Make button text slightly larger
    fontSize: 16,
    letterSpacing: 0.5,
  },
}));`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          overrideStyle()
        </Text>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          Completely replaces the style definition. Use when you need full control over a component's
          appearance. The base styles are discarded.
        </Text>

        <CodeBlock title="Overriding Card Styles">
{`import { overrideStyle } from '@idealyst/theme';
import { cardStyles } from '@idealyst/components';

// Completely replace Card styles
overrideStyle(cardStyles, (theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: 24,
    // Custom glassmorphism effect
    _web: {
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
  },
  cardOutlined: {
    borderWidth: 2,
    borderColor: theme.intents.primary.light,
  },
}));`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Import Order Matters
        </Text>

        <Card variant="outlined" style={{ padding: 20, marginBottom: 24, backgroundColor: '#fff8e6', borderColor: '#f59e0b' }}>
          <Text weight="semibold" style={{ marginBottom: 8, color: '#92400e' }}>
            Important: Style extensions must be imported before the component is used
          </Text>
          <Text size="sm" style={{ color: '#78350f', lineHeight: 22 }}>
            Style extensions work by mutating the style registry at import time.
            Import your style extension file early in your app (typically in App.tsx or a styles/index.ts barrel file).
          </Text>
        </Card>

        <CodeBlock title="App.tsx - Import Order">
{`// styles/index.ts - Import all style extensions
import './buttonExtensions';
import './cardExtensions';
import './inputExtensions';

// App.tsx
import './styles'; // Import extensions FIRST
import { Button, Card, Input } from '@idealyst/components';

function App() {
  // Components now use extended styles
  return <Button>Extended Button</Button>;
}`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Extending with Variants
        </Text>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          You can add new variants or modify existing variant behavior:
        </Text>

        <CodeBlock title="Adding Custom Variants">
{`import { extendStyle } from '@idealyst/theme';
import { buttonStyles } from '@idealyst/components';

extendStyle(buttonStyles, (theme) => ({
  button: {
    variants: {
      // Add a new "gradient" type variant
      type: {
        gradient: {
          _web: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
          _native: {
            backgroundColor: theme.intents.primary.primary,
          },
        },
      },
      // Add a new size variant
      size: {
        xxl: {
          paddingVertical: 20,
          paddingHorizontal: 40,
        },
      },
    },
  },
  text: {
    variants: {
      size: {
        xxl: {
          fontSize: 24,
        },
      },
    },
  },
}));`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Platform-Specific Extensions
        </Text>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          Use <Text weight="semibold">_web</Text> and <Text weight="semibold">_native</Text> prefixes
          to apply platform-specific style extensions:
        </Text>

        <CodeBlock title="Platform-Specific Styles">
{`extendStyle(cardStyles, (theme) => ({
  card: {
    // Shared styles
    borderRadius: theme.radii.lg,

    // Web-only styles
    _web: {
      transition: 'all 0.2s ease',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      },
    },

    // Native-only styles
    _native: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
}));`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          When to Use Each
        </Text>

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Card variant="outlined" style={{ flex: 1, minWidth: 280, padding: 20 }}>
            <Text weight="semibold" intent="success" style={{ marginBottom: 8 }}>
              Use extendStyle() when:
            </Text>
            <Text size="sm" style={{ color: '#666666', lineHeight: 22 }}>
              {`• Adding shadows, borders, or effects
• Tweaking spacing or sizing
• Adding new variants
• Making minor adjustments
• Keeping base behavior intact`}
            </Text>
          </Card>

          <Card variant="outlined" style={{ flex: 1, minWidth: 280, padding: 20 }}>
            <Text weight="semibold" intent="warning" style={{ marginBottom: 8 }}>
              Use overrideStyle() when:
            </Text>
            <Text size="sm" style={{ color: '#666666', lineHeight: 22 }}>
              {`• Completely redesigning a component
• Creating a unique brand aesthetic
• Removing default behaviors
• Starting from scratch
• Theme doesn't match existing styles`}
            </Text>
          </Card>
        </View>
      </View>
    </Screen>
  );
}
