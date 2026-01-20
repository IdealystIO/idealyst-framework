/**
 * Tests for the Theme Source Analyzer
 *
 * The theme source analyzer extracts theme keys directly from TypeScript source
 * without using hardcoded defaults. It traces the builder pattern to extract
 * intents, sizes, colors, etc.
 */

import * as path from 'path';
import { analyzeThemeSource, toBabelThemeKeys } from '../src/analyzer/theme-source-analyzer';

describe('Theme Source Analyzer', () => {
  const themePath = path.resolve(__dirname, '../../theme/src/lightTheme.ts');

  describe('analyzeThemeSource', () => {
    it('should extract all intent keys from the theme', () => {
      const values = analyzeThemeSource(themePath);

      expect(values.intents).toContain('primary');
      expect(values.intents).toContain('success');
      expect(values.intents).toContain('danger');
      expect(values.intents).toContain('warning');
      expect(values.intents).toContain('neutral');
      expect(values.intents).toContain('info');
      expect(values.intents).toHaveLength(6);
    });

    it('should extract all radius keys from the theme', () => {
      const values = analyzeThemeSource(themePath);

      expect(values.radii).toContain('none');
      expect(values.radii).toContain('xs');
      expect(values.radii).toContain('sm');
      expect(values.radii).toContain('md');
      expect(values.radii).toContain('lg');
      expect(values.radii).toContain('xl');
      expect(values.radii).toHaveLength(6);
    });

    it('should extract all shadow keys from the theme', () => {
      const values = analyzeThemeSource(themePath);

      expect(values.shadows).toContain('none');
      expect(values.shadows).toContain('sm');
      expect(values.shadows).toContain('md');
      expect(values.shadows).toContain('lg');
      expect(values.shadows).toContain('xl');
      expect(values.shadows).toHaveLength(5);
    });

    it('should extract breakpoint keys from the theme', () => {
      const values = analyzeThemeSource(themePath);

      expect(values.breakpoints).toContain('xs');
      expect(values.breakpoints).toContain('sm');
      expect(values.breakpoints).toContain('md');
      expect(values.breakpoints).toContain('lg');
      expect(values.breakpoints).toContain('xl');
      expect(values.breakpoints).toHaveLength(5);
    });

    describe('component sizes', () => {
      it('should extract button sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.button).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract iconButton sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.iconButton).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract chip sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.chip).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract badge sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.badge).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract alert sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.alert).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract input sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.input).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract select sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.select).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract switch sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.switch).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract slider sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.slider).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract avatar sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.avatar).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract progress sizes', () => {
        const values = analyzeThemeSource(themePath);
        expect(values.sizes.progress).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract all component size keys without hardcoded list', () => {
        const values = analyzeThemeSource(themePath);

        // These are extracted from the actual theme file, not hardcoded
        // The test verifies we get ALL components defined in the theme
        const expectedComponents = [
          'button',
          'iconButton',
          'chip',
          'badge',
          'icon',
          'input',
          'radioButton',
          'select',
          'slider',
          'switch',
          'textarea',
          'avatar',
          'progress',
          'accordion',
          'activityIndicator',
          'alert',
          'breadcrumb',
          'list',
          'menu',
          'text',
          'tabBar',
          'table',
          'tooltip',
          'view',
          'typography',
        ];

        // Verify all expected components are present
        for (const component of expectedComponents) {
          expect(values.sizes[component]).toBeDefined();
          expect(Array.isArray(values.sizes[component])).toBe(true);
          expect(values.sizes[component].length).toBeGreaterThan(0);
        }

        // Verify we have exactly the components in the theme (no hardcoded extras)
        expect(Object.keys(values.sizes).sort()).toEqual(expectedComponents.sort());
      });
    });

    describe('typography', () => {
      it('should extract typography keys from sizes.typography', () => {
        const values = analyzeThemeSource(themePath);

        expect(values.typography).toContain('h1');
        expect(values.typography).toContain('h2');
        expect(values.typography).toContain('h3');
        expect(values.typography).toContain('h4');
        expect(values.typography).toContain('h5');
        expect(values.typography).toContain('h6');
        expect(values.typography).toContain('subtitle1');
        expect(values.typography).toContain('subtitle2');
        expect(values.typography).toContain('body1');
        expect(values.typography).toContain('body2');
        expect(values.typography).toContain('caption');
        expect(values.typography).toHaveLength(11);
      });

      it('should also have typography in sizes', () => {
        const values = analyzeThemeSource(themePath);

        // Typography is also stored in sizes for iterator expansion
        expect(values.sizes.typography).toEqual(values.typography);
      });
    });

    describe('colors', () => {
      it('should extract surface color keys', () => {
        const values = analyzeThemeSource(themePath);

        expect(values.surfaceColors).toContain('screen');
        expect(values.surfaceColors).toContain('primary');
        expect(values.surfaceColors).toContain('secondary');
        expect(values.surfaceColors).toContain('tertiary');
        expect(values.surfaceColors).toContain('inverse');
        expect(values.surfaceColors).toContain('inverse-secondary');
        expect(values.surfaceColors).toContain('inverse-tertiary');
      });

      it('should extract text color keys', () => {
        const values = analyzeThemeSource(themePath);

        expect(values.textColors).toContain('primary');
        expect(values.textColors).toContain('secondary');
        expect(values.textColors).toContain('tertiary');
        expect(values.textColors).toContain('inverse');
        expect(values.textColors).toContain('inverse-secondary');
        expect(values.textColors).toContain('inverse-tertiary');
      });

      it('should extract border color keys', () => {
        const values = analyzeThemeSource(themePath);

        expect(values.borderColors).toContain('primary');
        expect(values.borderColors).toContain('secondary');
        expect(values.borderColors).toContain('tertiary');
        expect(values.borderColors).toContain('disabled');
      });
    });
  });

  describe('toBabelThemeKeys', () => {
    it('should convert ThemeValues to Babel plugin format', () => {
      const values = analyzeThemeSource(themePath);
      const keys = toBabelThemeKeys(values);

      // Should have the expected structure
      expect(keys).toHaveProperty('intents');
      expect(keys).toHaveProperty('sizes');
      expect(keys).toHaveProperty('radii');
      expect(keys).toHaveProperty('shadows');
      expect(keys).toHaveProperty('typography');

      // Should have correct values
      expect(keys.intents).toContain('primary');
      expect(keys.sizes.button).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      expect(keys.sizes.iconButton).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      expect(keys.sizes.alert).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
    });
  });

  describe('verbose mode', () => {
    it('should work with verbose logging enabled', () => {
      // Capture console.log
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args: unknown[]) => {
        logs.push(args.join(' '));
      };

      try {
        const values = analyzeThemeSource(themePath, { verbose: true });

        // Should still extract values correctly
        expect(values.intents).toContain('primary');
        expect(values.sizes.button).toBeDefined();

        // Should have logged something
        expect(logs.length).toBeGreaterThan(0);
        expect(logs.some(log => log.includes('theme-source-analyzer'))).toBe(true);
      } finally {
        console.log = originalLog;
      }
    });
  });

  describe('error handling', () => {
    it('should throw for non-existent theme file', () => {
      expect(() => {
        analyzeThemeSource('/path/to/nonexistent/theme.ts');
      }).toThrow('Theme file not found');
    });
  });

  describe('dark theme analysis', () => {
    const darkThemePath = path.resolve(__dirname, '../../theme/src/darkTheme.ts');

    it('should analyze dark theme and inherit from light theme', () => {
      const values = analyzeThemeSource(darkThemePath);

      // Dark theme uses fromTheme(lightTheme), so should have all the same keys
      expect(values.intents).toContain('primary');
      expect(values.sizes.button).toBeDefined();
      expect(values.sizes.iconButton).toBeDefined();
    });
  });

  describe('new builder methods parsing', () => {
    // These tests verify that the analyzer correctly parses the new builder methods
    // by creating temporary theme files with the new syntax

    const fs = require('fs');
    const os = require('os');

    function createTempThemeFile(content: string): string {
      const tmpDir = os.tmpdir();
      const tmpFile = path.join(tmpDir, `test-theme-${Date.now()}.ts`);
      fs.writeFileSync(tmpFile, content);
      return tmpFile;
    }

    function cleanupTempFile(filePath: string): void {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore cleanup errors
      }
    }

    describe('setIntent', () => {
      it('should parse setIntent method calls', () => {
        const content = `
          import { createTheme } from '@idealyst/theme';

          export const theme = createTheme()
            .addIntent('primary', { primary: '#000', contrast: '#fff', light: '#eee', dark: '#111' })
            .setIntent('primary', { primary: '#333', contrast: '#fff', light: '#ccc', dark: '#222' })
            .addIntent('success', { primary: '#0f0', contrast: '#fff', light: '#efe', dark: '#010' })
            .build();
        `;

        const tmpFile = createTempThemeFile(content);
        try {
          const values = analyzeThemeSource(tmpFile);
          expect(values.intents).toContain('primary');
          expect(values.intents).toContain('success');
          expect(values.intents).toHaveLength(2);
        } finally {
          cleanupTempFile(tmpFile);
        }
      });
    });

    describe('addSurfaceColor', () => {
      it('should parse addSurfaceColor method calls', () => {
        const content = `
          import { createTheme } from '@idealyst/theme';

          export const theme = createTheme()
            .addSurfaceColor('card', '#ffffff')
            .addSurfaceColor('modal', '#f5f5f5')
            .addSurfaceColor('overlay', 'rgba(0,0,0,0.5)')
            .build();
        `;

        const tmpFile = createTempThemeFile(content);
        try {
          const values = analyzeThemeSource(tmpFile);
          expect(values.surfaceColors).toContain('card');
          expect(values.surfaceColors).toContain('modal');
          expect(values.surfaceColors).toContain('overlay');
        } finally {
          cleanupTempFile(tmpFile);
        }
      });
    });

    describe('setSurfaceColor', () => {
      it('should parse setSurfaceColor method calls', () => {
        const content = `
          import { createTheme } from '@idealyst/theme';

          export const theme = createTheme()
            .addSurfaceColor('card', '#ffffff')
            .setSurfaceColor('card', '#f0f0f0')
            .build();
        `;

        const tmpFile = createTempThemeFile(content);
        try {
          const values = analyzeThemeSource(tmpFile);
          expect(values.surfaceColors).toContain('card');
          // Should only have one entry (not duplicated)
          expect(values.surfaceColors.filter(c => c === 'card')).toHaveLength(1);
        } finally {
          cleanupTempFile(tmpFile);
        }
      });
    });

    describe('addTextColor', () => {
      it('should parse addTextColor method calls', () => {
        const content = `
          import { createTheme } from '@idealyst/theme';

          export const theme = createTheme()
            .addTextColor('primary', '#000000')
            .addTextColor('muted', '#666666')
            .addTextColor('link', '#0066cc')
            .build();
        `;

        const tmpFile = createTempThemeFile(content);
        try {
          const values = analyzeThemeSource(tmpFile);
          expect(values.textColors).toContain('primary');
          expect(values.textColors).toContain('muted');
          expect(values.textColors).toContain('link');
        } finally {
          cleanupTempFile(tmpFile);
        }
      });
    });

    describe('setTextColor', () => {
      it('should parse setTextColor method calls', () => {
        const content = `
          import { createTheme } from '@idealyst/theme';

          export const theme = createTheme()
            .addTextColor('primary', '#000000')
            .setTextColor('primary', '#111111')
            .build();
        `;

        const tmpFile = createTempThemeFile(content);
        try {
          const values = analyzeThemeSource(tmpFile);
          expect(values.textColors).toContain('primary');
          expect(values.textColors.filter(c => c === 'primary')).toHaveLength(1);
        } finally {
          cleanupTempFile(tmpFile);
        }
      });
    });

    describe('addBorderColor', () => {
      it('should parse addBorderColor method calls', () => {
        const content = `
          import { createTheme } from '@idealyst/theme';

          export const theme = createTheme()
            .addBorderColor('default', '#e5e7eb')
            .addBorderColor('focus', '#3b82f6')
            .addBorderColor('error', '#ef4444')
            .build();
        `;

        const tmpFile = createTempThemeFile(content);
        try {
          const values = analyzeThemeSource(tmpFile);
          expect(values.borderColors).toContain('default');
          expect(values.borderColors).toContain('focus');
          expect(values.borderColors).toContain('error');
        } finally {
          cleanupTempFile(tmpFile);
        }
      });
    });

    describe('setBorderColor', () => {
      it('should parse setBorderColor method calls', () => {
        const content = `
          import { createTheme } from '@idealyst/theme';

          export const theme = createTheme()
            .addBorderColor('focus', '#3b82f6')
            .setBorderColor('focus', '#6366f1')
            .build();
        `;

        const tmpFile = createTempThemeFile(content);
        try {
          const values = analyzeThemeSource(tmpFile);
          expect(values.borderColors).toContain('focus');
          expect(values.borderColors.filter(c => c === 'focus')).toHaveLength(1);
        } finally {
          cleanupTempFile(tmpFile);
        }
      });
    });

    describe('addPalletColor and setPalletColor', () => {
      it('should parse addPalletColor method calls (logs only)', () => {
        const content = `
          import { createTheme } from '@idealyst/theme';

          export const theme = createTheme()
            .addPalletColor('brand', { 50: '#f0f', 100: '#e0e', 200: '#d0d', 300: '#c0c', 400: '#b0b', 500: '#a0a', 600: '#909', 700: '#808', 800: '#707', 900: '#606' })
            .build();
        `;

        const tmpFile = createTempThemeFile(content);
        try {
          // addPalletColor is logged but not tracked in values (shades are fixed)
          // This test just ensures it doesn't throw
          const values = analyzeThemeSource(tmpFile);
          expect(values).toBeDefined();
        } finally {
          cleanupTempFile(tmpFile);
        }
      });

      it('should parse setPalletColor method calls (logs only)', () => {
        const content = `
          import { createTheme } from '@idealyst/theme';

          export const theme = createTheme()
            .addPalletColor('brand', { 50: '#f0f', 100: '#e0e', 200: '#d0d', 300: '#c0c', 400: '#b0b', 500: '#a0a', 600: '#909', 700: '#808', 800: '#707', 900: '#606' })
            .setPalletColor('brand', { 50: '#fff', 100: '#eee', 200: '#ddd', 300: '#ccc', 400: '#bbb', 500: '#aaa', 600: '#999', 700: '#888', 800: '#777', 900: '#666' })
            .build();
        `;

        const tmpFile = createTempThemeFile(content);
        try {
          const values = analyzeThemeSource(tmpFile);
          expect(values).toBeDefined();
        } finally {
          cleanupTempFile(tmpFile);
        }
      });
    });

    describe('combined new methods', () => {
      it('should parse a theme using all new builder methods', () => {
        const content = `
          import { createTheme } from '@idealyst/theme';

          export const theme = createTheme()
            .addIntent('primary', { primary: '#3b82f6', contrast: '#fff', light: '#bfdbfe', dark: '#1e40af' })
            .addIntent('danger', { primary: '#ef4444', contrast: '#fff', light: '#fecaca', dark: '#b91c1c' })
            .setIntent('primary', { primary: '#6366f1', contrast: '#fff', light: '#a5b4fc', dark: '#4338ca' })
            .addPalletColor('blue', { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' })
            .addSurfaceColor('screen', '#ffffff')
            .addSurfaceColor('card', '#f9fafb')
            .setSurfaceColor('card', '#f3f4f6')
            .addTextColor('primary', '#111827')
            .addTextColor('secondary', '#6b7280')
            .setTextColor('primary', '#1f2937')
            .addBorderColor('default', '#e5e7eb')
            .addBorderColor('focus', '#3b82f6')
            .setBorderColor('focus', '#6366f1')
            .build();
        `;

        const tmpFile = createTempThemeFile(content);
        try {
          const values = analyzeThemeSource(tmpFile);

          // Intents
          expect(values.intents).toContain('primary');
          expect(values.intents).toContain('danger');
          expect(values.intents).toHaveLength(2);

          // Surface colors
          expect(values.surfaceColors).toContain('screen');
          expect(values.surfaceColors).toContain('card');
          expect(values.surfaceColors).toHaveLength(2);

          // Text colors
          expect(values.textColors).toContain('primary');
          expect(values.textColors).toContain('secondary');
          expect(values.textColors).toHaveLength(2);

          // Border colors
          expect(values.borderColors).toContain('default');
          expect(values.borderColors).toContain('focus');
          expect(values.borderColors).toHaveLength(2);
        } finally {
          cleanupTempFile(tmpFile);
        }
      });
    });
  });
});
