/**
 * Tests for the Theme Analyzer
 *
 * The theme analyzer extracts theme keys from theme files using the TypeScript
 * Compiler API. It traces the builder pattern to extract intents, sizes, etc.
 */

import * as path from 'path';
import { analyzeTheme, resetThemeCache, loadThemeKeys } from '../src/analyzer/theme-analyzer';

describe('Theme Analyzer', () => {
  beforeEach(() => {
    // Reset cache before each test
    resetThemeCache();
  });

  describe('analyzeTheme', () => {
    const themePath = path.resolve(__dirname, '../../theme/src/lightTheme.ts');

    it('should extract all intent keys from the theme', () => {
      const values = analyzeTheme(themePath);

      expect(values.intents).toContain('primary');
      expect(values.intents).toContain('success');
      expect(values.intents).toContain('danger');
      expect(values.intents).toContain('warning');
      expect(values.intents).toContain('neutral');
      expect(values.intents).toContain('info');
      expect(values.intents).toHaveLength(6);
    });

    it('should extract all radius keys from the theme', () => {
      const values = analyzeTheme(themePath);

      expect(values.radii).toContain('none');
      expect(values.radii).toContain('xs');
      expect(values.radii).toContain('sm');
      expect(values.radii).toContain('md');
      expect(values.radii).toContain('lg');
      expect(values.radii).toContain('xl');
    });

    it('should extract all shadow keys from the theme', () => {
      const values = analyzeTheme(themePath);

      expect(values.shadows).toContain('none');
      expect(values.shadows).toContain('sm');
      expect(values.shadows).toContain('md');
      expect(values.shadows).toContain('lg');
      expect(values.shadows).toContain('xl');
    });

    it('should extract breakpoint keys from the theme', () => {
      const values = analyzeTheme(themePath);

      expect(values.breakpoints).toContain('xs');
      expect(values.breakpoints).toContain('sm');
      expect(values.breakpoints).toContain('md');
      expect(values.breakpoints).toContain('lg');
      expect(values.breakpoints).toContain('xl');
    });

    describe('component sizes', () => {
      it('should extract button sizes', () => {
        const values = analyzeTheme(themePath);

        expect(values.sizes.button).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract chip sizes', () => {
        const values = analyzeTheme(themePath);

        expect(values.sizes.chip).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract badge sizes', () => {
        const values = analyzeTheme(themePath);

        expect(values.sizes.badge).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract alert sizes', () => {
        const values = analyzeTheme(themePath);

        expect(values.sizes.alert).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract input sizes', () => {
        const values = analyzeTheme(themePath);

        expect(values.sizes.input).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract select sizes', () => {
        const values = analyzeTheme(themePath);

        expect(values.sizes.select).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract switch sizes', () => {
        const values = analyzeTheme(themePath);

        expect(values.sizes.switch).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract slider sizes', () => {
        const values = analyzeTheme(themePath);

        expect(values.sizes.slider).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract avatar sizes', () => {
        const values = analyzeTheme(themePath);

        expect(values.sizes.avatar).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract progress sizes', () => {
        const values = analyzeTheme(themePath);

        expect(values.sizes.progress).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      });

      it('should extract all component size keys', () => {
        const values = analyzeTheme(themePath);

        // All components with size variants
        const expectedComponents = [
          'button',
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

        for (const component of expectedComponents) {
          expect(values.sizes[component]).toBeDefined();
          expect(Array.isArray(values.sizes[component])).toBe(true);
          expect(values.sizes[component].length).toBeGreaterThan(0);
        }
      });
    });

    describe('typography', () => {
      it('should extract typography keys', () => {
        const values = analyzeTheme(themePath);

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
      });

      it('should also have typography in sizes', () => {
        const values = analyzeTheme(themePath);

        // Typography is also stored in sizes for iterator expansion
        expect(values.sizes.typography).toEqual(values.typography);
      });
    });

    describe('colors', () => {
      it('should extract surface color keys', () => {
        const values = analyzeTheme(themePath);

        expect(values.surfaceColors).toContain('screen');
        expect(values.surfaceColors).toContain('primary');
        expect(values.surfaceColors).toContain('secondary');
        expect(values.surfaceColors).toContain('tertiary');
        expect(values.surfaceColors).toContain('inverse');
      });

      it('should extract text color keys', () => {
        const values = analyzeTheme(themePath);

        expect(values.textColors).toContain('primary');
        expect(values.textColors).toContain('secondary');
        expect(values.textColors).toContain('tertiary');
        expect(values.textColors).toContain('inverse');
      });

      it('should extract border color keys', () => {
        const values = analyzeTheme(themePath);

        expect(values.borderColors).toContain('primary');
        expect(values.borderColors).toContain('secondary');
        expect(values.borderColors).toContain('tertiary');
        expect(values.borderColors).toContain('disabled');
      });
    });
  });

  describe('loadThemeKeys (Babel compatibility)', () => {
    it('should return keys in Babel plugin format', () => {
      const rootDir = path.resolve(__dirname, '../../..');
      const keys = loadThemeKeys(
        { themePath: './packages/theme/src/lightTheme.ts' },
        rootDir
      );

      // Should have the expected structure
      expect(keys).toHaveProperty('intents');
      expect(keys).toHaveProperty('sizes');
      expect(keys).toHaveProperty('radii');
      expect(keys).toHaveProperty('shadows');
      expect(keys).toHaveProperty('typography');

      // Should have correct values
      expect(keys.intents).toContain('primary');
      expect(keys.sizes.button).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
      expect(keys.sizes.alert).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
    });

    it('should cache results', () => {
      const rootDir = path.resolve(__dirname, '../../..');
      const opts = { themePath: './packages/theme/src/lightTheme.ts' };

      const keys1 = loadThemeKeys(opts, rootDir);
      const keys2 = loadThemeKeys(opts, rootDir);

      // Should be the same cached object
      expect(keys1).toBe(keys2);
    });

    it('should reset cache correctly', () => {
      const rootDir = path.resolve(__dirname, '../../..');
      const opts = { themePath: './packages/theme/src/lightTheme.ts' };

      const keys1 = loadThemeKeys(opts, rootDir);
      resetThemeCache();
      const keys2 = loadThemeKeys(opts, rootDir);

      // Should have same values but be different objects (re-parsed)
      expect(keys1).not.toBe(keys2);
      expect(keys1.intents).toEqual(keys2.intents);
    });

    it('should throw if themePath is not provided', () => {
      const rootDir = path.resolve(__dirname, '../../..');

      expect(() => {
        loadThemeKeys({}, rootDir);
      }).toThrow('themePath is required');
    });
  });

  describe('error handling', () => {
    it('should throw for non-existent theme file', () => {
      expect(() => {
        analyzeTheme('/path/to/nonexistent/theme.ts');
      }).toThrow('Theme file not found');
    });
  });
});
