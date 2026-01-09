import * as babel from '@babel/core';
import * as path from 'path';
import * as fs from 'fs';

// Import the plugin
const plugin = require('../plugin');

// Reset the global registry before each test
beforeEach(() => {
  plugin.globalRegistry.clear();
});

function transform(code: string, options = {}, filename = 'test.tsx') {
  const result = babel.transformSync(code, {
    filename,
    presets: ['@babel/preset-typescript'],
    plugins: [[plugin, options]],
    babelrc: false,
    configFile: false,
  });
  return result;
}

function transformWithReact(code: string, options = {}, filename = 'test.tsx') {
  const result = babel.transformSync(code, {
    filename,
    presets: [
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [[plugin, options]],
    babelrc: false,
    configFile: false,
  });
  return result;
}

describe('Babel Plugin - Key Extraction', () => {
  describe('t() function calls', () => {
    it('extracts simple t() calls', () => {
      const code = `const label = t('common.hello');`;

      transform(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].key).toBe('common.hello');
      expect(keys[0].namespace).toBe('common');
      expect(keys[0].localKey).toBe('hello');
    });

    it('extracts t() with namespace:key format', () => {
      const code = `const label = t('auth:login.title');`;

      transform(code, { defaultNamespace: 'common' });
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].key).toBe('auth:login.title');
      expect(keys[0].namespace).toBe('auth');
      expect(keys[0].localKey).toBe('login.title');
    });

    it('extracts t() with interpolation options', () => {
      const code = `const greeting = t('common.greeting', { name: 'World' });`;

      transform(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].key).toBe('common.greeting');
    });

    it('extracts defaultValue from options', () => {
      const code = `const label = t('common.new', { defaultValue: 'New Feature' });`;

      transform(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].defaultValue).toBe('New Feature');
    });

    it('extracts i18n.t() calls', () => {
      const code = `const label = i18n.t('common.hello');`;

      transform(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].key).toBe('common.hello');
    });

    it('marks dynamic keys as isDynamic', () => {
      const code = `
        const key = 'common.' + someVar;
        const label = t(key);
      `;

      transform(code);
      const dynamicKeys = plugin.globalRegistry.getDynamicKeys();

      expect(dynamicKeys).toHaveLength(1);
      expect(dynamicKeys[0].isDynamic).toBe(true);
      expect(dynamicKeys[0].key).toBe('<dynamic>');
    });

    it('marks template literals with expressions as dynamic', () => {
      const code = 'const label = t(`common.${type}.title`);';

      transform(code);
      const dynamicKeys = plugin.globalRegistry.getDynamicKeys();

      expect(dynamicKeys).toHaveLength(1);
      expect(dynamicKeys[0].isDynamic).toBe(true);
    });

    it('treats template literals without expressions as static', () => {
      const code = 'const label = t(`common.hello`);';

      transform(code);
      const staticKeys = plugin.globalRegistry.getStaticKeys();

      expect(staticKeys).toHaveLength(1);
      expect(staticKeys[0].key).toBe('common.hello');
      expect(staticKeys[0].isDynamic).toBe(false);
    });
  });

  describe('<Trans> component', () => {
    it('extracts i18nKey from Trans component', () => {
      const code = `<Trans i18nKey="common.richText" />`;

      transformWithReact(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].key).toBe('common.richText');
    });

    it('extracts i18nKey with namespace prefix', () => {
      const code = `<Trans i18nKey="auth.terms" />`;

      transformWithReact(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].namespace).toBe('auth');
      expect(keys[0].localKey).toBe('terms');
    });

    it('extracts i18nKey from JSX expression', () => {
      const code = `<Trans i18nKey={"common.richText"} />`;

      transformWithReact(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].key).toBe('common.richText');
    });

    it('marks dynamic i18nKey as isDynamic', () => {
      const code = `<Trans i18nKey={dynamicKey} />`;

      transformWithReact(code);
      const dynamicKeys = plugin.globalRegistry.getDynamicKeys();

      expect(dynamicKeys).toHaveLength(1);
      expect(dynamicKeys[0].isDynamic).toBe(true);
    });
  });

  describe('multiple files', () => {
    it('aggregates keys from multiple transforms', () => {
      const code1 = `const a = t('common.key1');`;
      const code2 = `const b = t('common.key2');`;

      transform(code1, {}, 'file1.tsx');
      transform(code2, {}, 'file2.tsx');

      const keys = plugin.globalRegistry.getUniqueKeys();
      expect(keys).toHaveLength(2);
      expect(keys).toContain('common.key1');
      expect(keys).toContain('common.key2');
    });

    it('tracks same key used in multiple files', () => {
      transform(`const a = t('common.shared');`, {}, 'file1.tsx');
      transform(`const b = t('common.shared');`, {}, 'file2.tsx');

      const usages = plugin.globalRegistry.getKeyUsages('common.shared');
      expect(usages).toHaveLength(2);
      expect(usages[0].file).toContain('file1.tsx');
      expect(usages[1].file).toContain('file2.tsx');
    });
  });

  describe('source locations', () => {
    it('captures line and column numbers', () => {
      const code = `const label = t('common.test');`;

      transform(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].line).toBeGreaterThan(0);
      expect(keys[0].column).toBeGreaterThanOrEqual(0);
    });
  });

  describe('default namespace', () => {
    it('uses configured default namespace', () => {
      const code = `const label = t('buttonLabel');`;

      transform(code, { defaultNamespace: 'ui' });
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].namespace).toBe('ui');
      expect(keys[0].localKey).toBe('buttonLabel');
    });

    it('uses translation as default when not configured', () => {
      const code = `const label = t('buttonLabel');`;

      transform(code, {});
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].namespace).toBe('translation');
    });
  });
});

describe('Babel Plugin - Report Generation (via generateReport)', () => {
  // Note: Full report generation through the plugin is tested in reporter.test.ts
  // These tests verify the plugin correctly passes keys to the report generator

  it('passes extracted keys for report generation', () => {
    plugin.globalRegistry.clear();

    const code1 = `const a = t('common.hello');`;
    const code2 = `const b = t('common.world');`;

    transform(code1, {}, 'file1.tsx');
    transform(code2, {}, 'file2.tsx');

    // Verify keys are in registry
    const keys = plugin.globalRegistry.getStaticKeys();
    expect(keys).toHaveLength(2);

    // Generate report using the plugin's exported function
    const report = plugin.generateReport(keys, {
      translationFiles: [],
      languages: ['en', 'es'],
      defaultNamespace: 'common',
    });

    expect(report.totalKeys).toBe(2);
    expect(report.languages).toContain('en');
    expect(report.languages).toContain('es');
  });

  it('includes dynamic keys in report', () => {
    plugin.globalRegistry.clear();

    const code = `
      const key = dynamicVar;
      const label = t(key);
    `;

    transform(code);

    const report = plugin.generateReport(plugin.globalRegistry.getAllKeys(), {
      translationFiles: [],
      languages: ['en'],
      defaultNamespace: 'common',
    });

    expect(report.dynamicKeys).toHaveLength(1);
    expect(report.dynamicKeys[0].isDynamic).toBe(true);
  });

  it('exports generateReport and writeReport functions', () => {
    expect(typeof plugin.generateReport).toBe('function');
    expect(typeof plugin.writeReport).toBe('function');
    expect(typeof plugin.parseKey).toBe('function');
  });
});
