/**
 * Tests for the Idealyst StyleBuilder Babel Plugin
 *
 * Tests cover:
 * - $iterator expansion for intents (theme.$intents.primary)
 * - $iterator expansion for sizes (theme.sizes.$button.paddingVertical)
 * - $iterator expansion for typography (theme.sizes.$typography.fontSize)
 * - compoundVariants expansion
 * - defineStyle transformation
 */

import * as babel from '@babel/core';
import * as path from 'path';

// Import the plugin
const plugin = require('../src/babel/plugin.js');

// Mock theme keys for testing (avoids needing to parse actual theme file)
const mockThemeKeys = {
  intents: ['primary', 'success', 'danger', 'warning', 'neutral', 'info'],
  sizes: {
    button: ['xs', 'sm', 'md', 'lg', 'xl'],
    chip: ['xs', 'sm', 'md', 'lg', 'xl'],
    alert: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  typography: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption'],
  radii: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
  shadows: ['none', 'sm', 'md', 'lg', 'xl'],
};

// Helper to transform code with the plugin
function transform(code: string, options: Record<string, any> = {}): string {
  const result = babel.transformSync(code, {
    filename: 'test.styles.tsx',
    presets: ['@babel/preset-typescript'],
    plugins: [
      [plugin, {
        themePath: path.resolve(__dirname, '../src/lightTheme.ts'),
        processAll: true,
        ...options,
      }],
    ],
  });

  if (!result?.code) {
    throw new Error('Babel transformation failed');
  }

  return result.code;
}

// Helper to extract a specific section from transformed code
function extractSection(code: string, startPattern: RegExp, endPattern?: RegExp): string {
  const lines = code.split('\n');
  let capturing = false;
  let braceCount = 0;
  const result: string[] = [];

  for (const line of lines) {
    if (!capturing && startPattern.test(line)) {
      capturing = true;
    }

    if (capturing) {
      result.push(line);
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;

      if (braceCount <= 0 || (endPattern && endPattern.test(line))) {
        break;
      }
    }
  }

  return result.join('\n');
}

describe('Idealyst Babel Plugin', () => {
  describe('$intents iterator expansion', () => {
    it('should expand theme.$intents.primary to all intent keys', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Test', (theme) => ({
          container: {
            variants: {
              intent: {
                backgroundColor: theme.$intents.primary,
              },
            },
          },
        }));
      `;

      const output = transform(input);

      // Should expand to all 6 intents
      expect(output).toContain('primary: {');
      expect(output).toContain('success: {');
      expect(output).toContain('danger: {');
      expect(output).toContain('warning: {');
      expect(output).toContain('neutral: {');
      expect(output).toContain('info: {');

      // Should have correct theme references
      expect(output).toContain('theme.intents.primary.primary');
      expect(output).toContain('theme.intents.success.primary');
      expect(output).toContain('theme.intents.danger.primary');
    });

    it('should expand theme.$intents.contrast correctly', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Test', (theme) => ({
          text: {
            variants: {
              intent: {
                color: theme.$intents.contrast,
              },
            },
          },
        }));
      `;

      const output = transform(input);

      expect(output).toContain('theme.intents.primary.contrast');
      expect(output).toContain('theme.intents.success.contrast');
    });

    it('should expand theme.$intents.light correctly', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Test', (theme) => ({
          container: {
            variants: {
              intent: {
                backgroundColor: theme.$intents.light,
              },
            },
          },
        }));
      `;

      const output = transform(input);

      expect(output).toContain('theme.intents.primary.light');
      expect(output).toContain('theme.intents.warning.light');
    });
  });

  describe('$sizes iterator expansion', () => {
    it('should expand theme.sizes.$button for size variants', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Button', (theme) => ({
          button: {
            variants: {
              size: {
                paddingVertical: theme.sizes.$button.paddingVertical,
                paddingHorizontal: theme.sizes.$button.paddingHorizontal,
              },
            },
          },
        }));
      `;

      const output = transform(input);

      // Should expand to all 5 sizes
      expect(output).toContain('xs: {');
      expect(output).toContain('sm: {');
      expect(output).toContain('md: {');
      expect(output).toContain('lg: {');
      expect(output).toContain('xl: {');

      // Should have correct theme references
      expect(output).toContain('theme.sizes.button.xs.paddingVertical');
      expect(output).toContain('theme.sizes.button.md.paddingHorizontal');
      expect(output).toContain('theme.sizes.button.xl.paddingVertical');
    });

    it('should expand theme.sizes.$alert for alert component', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Alert', (theme) => ({
          container: {
            variants: {
              size: {
                gap: theme.sizes.$alert.gap,
                padding: theme.sizes.$alert.padding,
                borderRadius: theme.sizes.$alert.borderRadius,
              },
            },
          },
        }));
      `;

      const output = transform(input);

      // Should expand to all sizes
      expect(output).toContain('xs: {');
      expect(output).toContain('md: {');
      expect(output).toContain('xl: {');

      // Should have correct theme references
      expect(output).toContain('theme.sizes.alert.xs.gap');
      expect(output).toContain('theme.sizes.alert.md.padding');
      expect(output).toContain('theme.sizes.alert.lg.borderRadius');
    });
  });

  describe('$typography iterator expansion', () => {
    it('should expand theme.sizes.$typography for typography variants', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Text', (theme) => ({
          text: {
            variants: {
              typography: {
                fontSize: theme.sizes.$typography.fontSize,
                lineHeight: theme.sizes.$typography.lineHeight,
              },
            },
          },
        }));
      `;

      const output = transform(input);

      // Should expand to all typography keys
      expect(output).toContain('h1: {');
      expect(output).toContain('h2: {');
      expect(output).toContain('body1: {');
      expect(output).toContain('caption: {');

      // Should have correct theme references
      expect(output).toContain('theme.sizes.typography.h1.fontSize');
      expect(output).toContain('theme.sizes.typography.body1.lineHeight');
    });
  });

  describe('compoundVariants expansion', () => {
    it('should expand $intents in compoundVariants styles', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Chip', (theme) => ({
          container: {
            variants: {
              type: {
                filled: {},
                outlined: {},
              },
              selected: {
                true: {},
                false: {},
              },
            },
            compoundVariants: [
              { type: 'filled', selected: false, styles: { backgroundColor: theme.$intents.primary } },
              { type: 'outlined', selected: true, styles: { borderColor: theme.$intents.primary } },
            ],
          },
        }));
      `;

      const output = transform(input);

      // Each compound variant should be expanded for all intents
      // Original: 2 compound variants
      // After expansion: 2 * 6 = 12 compound variants

      // Check that intent keys are added to compound variants
      // Note: Babel outputs double quotes for string literals
      expect(output).toContain('intent: "primary"');
      expect(output).toContain('intent: "success"');
      expect(output).toContain('intent: "danger"');

      // Check correct theme references in expanded styles
      expect(output).toContain('theme.intents.primary.primary');
      expect(output).toContain('theme.intents.success.primary');
    });

    it('should expand $intents.contrast in compoundVariants', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Chip', (theme) => ({
          label: {
            variants: {
              type: {
                filled: {},
                outlined: {},
              },
              selected: {
                true: {},
                false: {},
              },
            },
            compoundVariants: [
              { type: 'filled', selected: false, styles: { color: theme.$intents.contrast } },
            ],
          },
        }));
      `;

      const output = transform(input);

      // Should expand and use .contrast accessor
      expect(output).toContain('theme.intents.primary.contrast');
      expect(output).toContain('theme.intents.danger.contrast');
    });

    it('should preserve non-iterator compound variants unchanged', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Test', (theme) => ({
          container: {
            variants: {
              size: {
                sm: {},
                lg: {},
              },
              disabled: {
                true: {},
                false: {},
              },
            },
            compoundVariants: [
              { size: 'sm', disabled: true, styles: { opacity: 0.5 } },
            ],
          },
        }));
      `;

      const output = transform(input);

      // Should keep the compound variant as-is (no $iterator pattern)
      expect(output).toContain("size: 'sm'");
      expect(output).toContain("disabled: true");
      expect(output).toContain('opacity: 0.5');
    });
  });

  describe('mixed variants', () => {
    it('should handle both intent and size variants in same style', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Button', (theme) => ({
          button: {
            variants: {
              intent: {
                backgroundColor: theme.$intents.primary,
              },
              size: {
                paddingVertical: theme.sizes.$button.paddingVertical,
              },
            },
          },
        }));
      `;

      const output = transform(input);

      // Both should be expanded
      expect(output).toContain('theme.intents.primary.primary');
      expect(output).toContain('theme.intents.success.primary');
      expect(output).toContain('theme.sizes.button.xs.paddingVertical');
      expect(output).toContain('theme.sizes.button.lg.paddingVertical');
    });
  });

  describe('dynamic style functions', () => {
    it('should handle arrow function style definitions', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        type Props = { intent?: string };

        export const styles = defineStyle('Button', (theme) => ({
          button: (props: Props) => ({
            variants: {
              size: {
                paddingVertical: theme.sizes.$button.paddingVertical,
              },
            },
          }),
        }));
      `;

      const output = transform(input);

      // Should still expand within the arrow function
      expect(output).toContain('theme.sizes.button.xs.paddingVertical');
      expect(output).toContain('theme.sizes.button.md.paddingVertical');
    });
  });

  describe('StyleSheet.create transformation', () => {
    it('should transform defineStyle to StyleSheet.create', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Test', (theme) => ({
          container: {
            backgroundColor: theme.colors.surface.primary,
          },
        }));
      `;

      const output = transform(input);

      // Should be transformed to StyleSheet.create
      expect(output).toContain('StyleSheet.create');
      // Should NOT contain defineStyle
      expect(output).not.toContain('defineStyle(');
    });
  });

  describe('edge cases', () => {
    it('should handle empty variants object', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Test', (theme) => ({
          container: {
            backgroundColor: 'red',
            variants: {},
          },
        }));
      `;

      // Should not throw
      expect(() => transform(input)).not.toThrow();
    });

    it('should handle styles without variants', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Test', (theme) => ({
          container: {
            backgroundColor: theme.colors.surface.primary,
            padding: 16,
          },
        }));
      `;

      const output = transform(input);

      // Should preserve non-variant styles
      expect(output).toContain('theme.colors.surface.primary');
      expect(output).toContain('padding: 16');
    });

    it('should handle nested variant values', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Test', (theme) => ({
          container: {
            variants: {
              type: {
                filled: {
                  backgroundColor: theme.$intents.primary,
                  borderColor: theme.$intents.primary,
                },
                outlined: {
                  backgroundColor: 'transparent',
                  borderColor: theme.$intents.primary,
                },
              },
            },
          },
        }));
      `;

      const output = transform(input);

      // Should expand the type variant properly with nested intent expansion
      expect(output).toContain('filled');
      expect(output).toContain('outlined');
      expect(output).toContain('theme.intents');
    });

    it('should not process files without processAll or autoProcessPaths', () => {
      const input = `
        import { StyleSheet } from 'react-native-unistyles';
        import { defineStyle } from '@idealyst/theme';

        export const styles = defineStyle('Test', (theme) => ({
          container: {
            variants: {
              intent: {
                backgroundColor: theme.$intents.primary,
              },
            },
          },
        }));
      `;

      const result = babel.transformSync(input, {
        filename: 'test.styles.tsx',
        presets: ['@babel/preset-typescript'],
        plugins: [
          [plugin, {
            themePath: path.resolve(__dirname, '../src/lightTheme.ts'),
            // No processAll or autoProcessPaths
          }],
        ],
      });

      // Should not expand (file not processed)
      expect(result?.code).toContain('defineStyle');
      expect(result?.code).toContain('theme.$intents');
    });
  });
});
