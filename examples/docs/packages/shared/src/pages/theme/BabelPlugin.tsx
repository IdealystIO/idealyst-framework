import React from 'react';
import { View, Text, Card, Screen } from '@idealyst/components';
import { CodeBlock } from '../../components/CodeBlock';

export function BabelPluginPage() {
  return (
    <Screen>
      <View style={{ maxWidth: 900 }}>
        <Text size="xl" weight="bold" style={{ marginBottom: 16 }}>
          Babel Plugin Configuration
        </Text>

        <Text style={{ marginBottom: 32, lineHeight: 26, color: '#333333' }}>
          The Idealyst Babel plugin transforms <Text weight="semibold">defineStyle()</Text> calls
          into optimized <Text weight="semibold">StyleSheet.create()</Text> at build time.
          It also expands the <Text weight="semibold">$iterator</Text> pattern for variant generation.
        </Text>

        <Text weight="semibold" size="lg" style={{ marginBottom: 12 }}>
          Installation
        </Text>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          The Babel plugin is included with <Text weight="semibold">@idealyst/theme</Text>.
          Configure it in your babel.config.js:
        </Text>

        <CodeBlock title="babel.config.js (React Native)">
{`module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Idealyst plugin runs FIRST to expand $iterator patterns
    [
      '@idealyst/theme/babel',
      {
        // Path to your theme file (relative to project root)
        themePath: './src/styles/theme.ts',

        // Optional: Paths to auto-process (defaults shown)
        autoProcessPaths: [
          '@idealyst/components',
          '@idealyst/navigation',
          './src',
        ],

        // Optional: Enable debug logging
        debug: false,
      },
    ],

    // Unistyles plugin runs SECOND
    ['react-native-unistyles/plugin'],
  ],
};`}
        </CodeBlock>

        <CodeBlock title="vite.config.ts (Web with Vite)">
{`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from 'vite-plugin-babel';
import path from 'path';

export default defineConfig({
  plugins: [
    babel({
      filter: (id) =>
        id.includes('node_modules/@idealyst/') ||
        (id.includes('/src/') && /\\.(tsx?|jsx?)$/.test(id)),
      babelConfig: {
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }],
          ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
        ],
        plugins: [
          // Idealyst plugin FIRST
          [
            '@idealyst/theme/babel',
            {
              themePath: './packages/shared/src/styles.ts',
              autoProcessPaths: [
                '@idealyst/components',
                '@idealyst/navigation',
                './packages',
              ],
              debug: true,
            },
          ],
          // Unistyles plugin SECOND
          ['react-native-unistyles/plugin', { root: 'src' }],
        ],
      },
    }),
    react(),
  ],
});`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Plugin Options
        </Text>

        <Card variant="outlined" style={{ padding: 20, marginBottom: 24 }}>
          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>themePath</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              Required. Path to your theme file that exports the built theme. The plugin reads
              theme keys to expand $iterator patterns.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>autoProcessPaths</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              Optional. Array of paths to automatically process. Files in these paths will have
              defineStyle() calls transformed without explicit configuration.
            </Text>
          </View>

          <View>
            <Text weight="semibold" style={{ marginBottom: 4 }}>debug</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              Optional. When true, logs transformation details to console. Useful for
              troubleshooting style expansion issues.
            </Text>
          </View>
        </Card>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          The $iterator Pattern
        </Text>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          The <Text weight="semibold">$iterator</Text> pattern allows you to define styles once
          that automatically expand to all keys of a theme object. This is used extensively
          for intent colors and sizes.
        </Text>

        <CodeBlock title="How $iterator Works">
{`// You write this:
export const buttonStyles = defineStyle('Button', (theme: Theme) => ({
  button: {
    variants: {
      size: {
        paddingVertical: theme.sizes.$button.paddingVertical,
        paddingHorizontal: theme.sizes.$button.paddingHorizontal,
      },
    },
  },
}));

// Plugin transforms it to:
export const buttonStyles = StyleSheet.create((theme) => ({
  button: {
    variants: {
      size: {
        xs: {
          paddingVertical: theme.sizes.button.xs.paddingVertical,
          paddingHorizontal: theme.sizes.button.xs.paddingHorizontal,
        },
        sm: {
          paddingVertical: theme.sizes.button.sm.paddingVertical,
          paddingHorizontal: theme.sizes.button.sm.paddingHorizontal,
        },
        md: {
          paddingVertical: theme.sizes.button.md.paddingVertical,
          paddingHorizontal: theme.sizes.button.md.paddingHorizontal,
        },
        lg: {
          paddingVertical: theme.sizes.button.lg.paddingVertical,
          paddingHorizontal: theme.sizes.button.lg.paddingHorizontal,
        },
        xl: {
          paddingVertical: theme.sizes.button.xl.paddingVertical,
          paddingHorizontal: theme.sizes.button.xl.paddingHorizontal,
        },
      },
    },
  },
}));`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          ThemeStyleWrapper Type
        </Text>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          To get TypeScript support for $iterator patterns, wrap your theme type with
          <Text weight="semibold"> ThemeStyleWrapper</Text>:
        </Text>

        <CodeBlock title="Type Setup for $iterator">
{`import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Wrap theme type for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

// Now TypeScript understands theme.sizes.$button
export const buttonStyles = defineStyle('Button', (theme: Theme) => ({
  button: {
    variants: {
      size: {
        // TypeScript knows $button exists and has paddingVertical
        paddingVertical: theme.sizes.$button.paddingVertical,
      },
    },
  },
}));`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Plugin Order
        </Text>

        <Card variant="outlined" style={{ padding: 20, marginBottom: 24, backgroundColor: '#fff8e6', borderColor: '#f59e0b' }}>
          <Text weight="semibold" style={{ marginBottom: 8, color: '#92400e' }}>
            Critical: Plugin order matters!
          </Text>
          <Text size="sm" style={{ color: '#78350f', lineHeight: 22 }}>
            The Idealyst plugin MUST run BEFORE the Unistyles plugin. Idealyst expands $iterator
            patterns and transforms defineStyle() calls. Then Unistyles processes the resulting
            StyleSheet.create() calls for runtime optimization.
          </Text>
        </Card>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          Correct plugin order:
        </Text>

        <View style={{ marginLeft: 16, marginBottom: 24 }}>
          <Text style={{ marginBottom: 8, color: '#333333' }}>
            1. <Text weight="semibold">@idealyst/theme/babel</Text> - Expands $iterator, transforms defineStyle()
          </Text>
          <Text style={{ marginBottom: 8, color: '#333333' }}>
            2. <Text weight="semibold">react-native-unistyles/plugin</Text> - Runtime optimization
          </Text>
          <Text style={{ color: '#333333' }}>
            3. <Text weight="semibold">Other plugins</Text> - React, etc.
          </Text>
        </View>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Debugging Transformations
        </Text>

        <Text style={{ marginBottom: 16, lineHeight: 24, color: '#333333' }}>
          Enable debug mode to see what the plugin is doing:
        </Text>

        <CodeBlock title="Debug Output Example">
{`// With debug: true, you'll see in console:

[Idealyst] Processing: src/components/Button.styles.tsx
[Idealyst] Found defineStyle call: 'Button'
[Idealyst] Expanding $iterator: theme.sizes.$button
[Idealyst]   -> Keys: xs, sm, md, lg, xl
[Idealyst] Transformed to StyleSheet.create()

// This helps identify:
// - Files being processed
// - $iterator expansions
// - Any transformation errors`}
        </CodeBlock>

        <Text weight="semibold" size="lg" style={{ marginTop: 32, marginBottom: 12 }}>
          Troubleshooting
        </Text>

        <Card variant="outlined" style={{ padding: 20 }}>
          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>Styles not applying?</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              Check that your file path is included in autoProcessPaths and the file extension
              matches the filter.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>$iterator not expanding?</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              Verify themePath points to a valid theme file. Enable debug mode to see if
              the plugin is reading theme keys correctly.
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text weight="semibold" style={{ marginBottom: 4 }}>TypeScript errors with $iterator?</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              Make sure to use ThemeStyleWrapper to wrap your theme type. This adds the
              $-prefixed iterator types.
            </Text>
          </View>

          <View>
            <Text weight="semibold" style={{ marginBottom: 4 }}>Build errors after adding plugin?</Text>
            <Text size="sm" style={{ color: '#666666' }}>
              Clear your build cache (metro: --reset-cache, vite: rm -rf node_modules/.vite)
              and restart the bundler.
            </Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}
