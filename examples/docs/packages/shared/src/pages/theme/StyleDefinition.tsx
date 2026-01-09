import React from 'react';
import { View, Text, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function StyleDefinitionPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 800 }}>
        <Text typography="h2" weight="bold" style={{ marginBottom: 16 }}>
          Style Definition API
        </Text>

        <Text typography="body1" color="secondary" style={{ marginBottom: 24, lineHeight: 26 }}>
          The <Text style={{ fontFamily: 'monospace' }}>defineStyle()</Text> function creates
          component styles with theme reactivity and variant support. The Babel plugin transforms
          these to <Text style={{ fontFamily: 'monospace' }}>StyleSheet.create()</Text> calls.
        </Text>

        <Text weight="semibold" typography="h4" style={{ marginBottom: 12 }}>
          Basic Usage
        </Text>

        <CodeBlock
          code={`import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export const buttonStyles = defineStyle('Button', (theme: Theme) => ({
  button: {
    borderRadius: theme.radii.md,
    backgroundColor: theme.intents.primary.primary,

    variants: {
      size: {
        // $iterator expands to all size keys
        paddingVertical: theme.sizes.$button.paddingVertical,
        paddingHorizontal: theme.sizes.$button.paddingHorizontal,
      },
      disabled: {
        true: { opacity: 0.5 },
        false: { opacity: 1 },
      },
    },
  },
  text: {
    color: theme.intents.primary.contrast,
    variants: {
      size: {
        fontSize: theme.sizes.$button.fontSize,
      },
    },
  },
}));`}
          language="typescript"
          title="defineStyle() Example"
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Dynamic Style Functions
        </Text>
        <Text typography="body1" color="tertiary" style={{ marginBottom: 16 }}>
          For styles that depend on runtime props, use dynamic functions:
        </Text>

        <CodeBlock
          code={`export const buttonStyles = defineStyle('Button', (theme: Theme) => ({
  button: ({ intent = 'primary', type = 'contained' }: ButtonDynamicProps) => ({
    backgroundColor: type === 'contained'
      ? theme.intents[intent].primary
      : 'transparent',
    borderColor: type === 'outlined'
      ? theme.intents[intent].primary
      : 'transparent',
  }),
}));`}
          language="typescript"
          title="Dynamic Styles"
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          Using Styles in Components
        </Text>

        <CodeBlock
          code={`import { buttonStyles } from './Button.styles';

const Button = ({ size = 'md', disabled = false, intent, type }) => {
  // Apply variants
  buttonStyles.useVariants({ size, disabled });

  // Static styles - no function call
  const staticStyle = buttonStyles.button;

  // Dynamic styles - function call with props
  const dynamicStyle = (buttonStyles.button as any)({ intent, type });

  return (
    <TouchableOpacity style={dynamicStyle}>
      <Text style={buttonStyles.text}>Click me</Text>
    </TouchableOpacity>
  );
};`}
          language="typescript"
          title="Component Usage"
        />

        <Text weight="semibold" typography="h4" style={{ marginTop: 32, marginBottom: 12 }}>
          When to Use Dynamic vs Static
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Text weight="semibold" style={{ marginBottom: 8 }}>
            Use Static Styles (Variants) When:
          </Text>
          <Text typography="body1" color="tertiary" style={{ marginLeft: 16 }}>
            - Boolean toggles (enabled/disabled){'\n'}
            - Enumerated variants (size, type){'\n'}
            - Theme values are fixed
          </Text>
        </View>

        <View>
          <Text weight="semibold" style={{ marginBottom: 8 }}>
            Use Dynamic Styles When:
          </Text>
          <Text typography="body1" color="tertiary" style={{ marginLeft: 16 }}>
            - Prop-dependent color lookups{'\n'}
            - Complex conditional logic{'\n'}
            - Style depends on multiple props
          </Text>
        </View>
      </View>
    </Screen>
  );
}
