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
});
