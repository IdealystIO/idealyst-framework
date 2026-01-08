import * as babel from '@babel/core';
import * as path from 'path';
import * as fs from 'fs';

// Import the plugin
const plugin = require('../plugin');

// Reset the global registry before each test
beforeEach(() => {
  plugin.globalRegistry.clear();
});

function transform(code: string, options = {}) {
  const result = babel.transformSync(code, {
    filename: 'test.tsx',
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
      const code = `
        import { useTranslation } from '@idealyst/translate';
        function Component() {
          const { t } = useTranslation();
          return <div>{t('common.hello')}</div>;
        }
      `;

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
      const code = `
        import { useTranslation } from '@idealyst/translate';
        function Component() {
          const { i18n } = useTranslation();
          return <div>{i18n.t('common.hello')}</div>;
        }
      `;

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
      const code = `
        import { Trans } from '@idealyst/translate';
        function Component() {
          return <Trans i18nKey="common.richText" />;
        }
      `;

      transform(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].key).toBe('common.richText');
    });

    it('extracts i18nKey with namespace prefix', () => {
      const code = `<Trans i18nKey="auth.terms" />`;

      transform(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].namespace).toBe('auth');
      expect(keys[0].localKey).toBe('terms');
    });

    it('extracts i18nKey from JSX expression', () => {
      const code = `<Trans i18nKey={"common.richText"} />`;

      transform(code);
      const keys = plugin.globalRegistry.getStaticKeys();

      expect(keys).toHaveLength(1);
      expect(keys[0].key).toBe('common.richText');
    });

    it('marks dynamic i18nKey as isDynamic', () => {
      const code = `<Trans i18nKey={dynamicKey} />`;

      transform(code);
      const dynamicKeys = plugin.globalRegistry.getDynamicKeys();

      expect(dynamicKeys).toHaveLength(1);
      expect(dynamicKeys[0].isDynamic).toBe(true);
    });
  });

  describe('multiple files', () => {
    it('aggregates keys from multiple transforms', () => {
      const code1 = `const a = t('common.key1');`;
      const code2 = `const b = t('common.key2');`;

      transform(code1);
      transform(code2);

      const keys = plugin.globalRegistry.getUniqueKeys();
      expect(keys).toHaveLength(2);
      expect(keys).toContain('common.key1');
      expect(keys).toContain('common.key2');
    });

    it('tracks same key used in multiple files', () => {
      // Simulate different files
      babel.transformSync(`const a = t('common.shared');`, {
        filename: 'file1.tsx',
        plugins: [[plugin, {}]],
        presets: ['@babel/preset-typescript'],
      });

      babel.transformSync(`const b = t('common.shared');`, {
        filename: 'file2.tsx',
        plugins: [[plugin, {}]],
        presets: ['@babel/preset-typescript'],
      });

      const usages = plugin.globalRegistry.getKeyUsages('common.shared');
      expect(usages).toHaveLength(2);
      expect(usages[0].file).toBe('file1.tsx');
      expect(usages[1].file).toBe('file2.tsx');
    });
  });

  describe('source locations', () => {
    it('captures line and column numbers', () => {
      const code = `
        // Line 1: comment
        const label = t('common.test'); // Line 2
      `;

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

describe('Babel Plugin - Report Generation', () => {
  const tempDir = path.join(__dirname, '.temp-test');
  const localesDir = path.join(tempDir, 'locales');

  beforeAll(() => {
    // Create temp directories and translation files
    fs.mkdirSync(path.join(localesDir, 'en'), { recursive: true });
    fs.mkdirSync(path.join(localesDir, 'es'), { recursive: true });

    fs.writeFileSync(
      path.join(localesDir, 'en', 'common.json'),
      JSON.stringify({
        hello: 'Hello',
        world: 'World',
        unused: 'This is unused',
      })
    );

    fs.writeFileSync(
      path.join(localesDir, 'es', 'common.json'),
      JSON.stringify({
        hello: 'Hola',
        // 'world' is missing in Spanish
      })
    );
  });

  afterAll(() => {
    // Clean up temp files
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('generates report with missing translations', () => {
    const code = `
      const a = t('common.hello');
      const b = t('common.world');
    `;

    const reportPath = path.join(tempDir, 'report.json');

    transform(code, {
      translationFiles: [path.join(localesDir, '**/*.json')],
      reportPath,
      defaultNamespace: 'common',
    });

    expect(fs.existsSync(reportPath)).toBe(true);

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    expect(report.totalKeys).toBe(2);
    expect(report.languages).toContain('en');
    expect(report.languages).toContain('es');

    // Spanish is missing 'world'
    expect(report.missing.es.length).toBeGreaterThan(0);
    const missingWorld = report.missing.es.find(
      (m: any) => m.key === 'common.world'
    );
    expect(missingWorld).toBeDefined();
  });

  it('generates report with unused translations', () => {
    plugin.globalRegistry.clear();

    const code = `const a = t('common.hello');`;
    const reportPath = path.join(tempDir, 'report2.json');

    transform(code, {
      translationFiles: [path.join(localesDir, '**/*.json')],
      reportPath,
      defaultNamespace: 'common',
    });

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    // 'unused' key exists in en/common.json but not used in code
    expect(report.unused.en).toContain('common.unused');
  });

  it('calculates coverage percentages', () => {
    plugin.globalRegistry.clear();

    const code = `
      const a = t('common.hello');
      const b = t('common.world');
    `;
    const reportPath = path.join(tempDir, 'report3.json');

    transform(code, {
      translationFiles: [path.join(localesDir, '**/*.json')],
      reportPath,
      defaultNamespace: 'common',
    });

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    expect(report.summary.coveragePercent.en).toBe(100);
    expect(report.summary.coveragePercent.es).toBeLessThan(100);
  });
});
