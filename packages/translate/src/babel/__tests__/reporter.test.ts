import * as fs from 'fs';
import * as path from 'path';
import { generateReport, writeReport, loadTranslations } from '../reporter';
import type { ExtractedKey, TranslatePluginOptions } from '../types';

describe('loadTranslations', () => {
  const tempDir = path.join(__dirname, '.temp-loader-test');

  beforeAll(() => {
    fs.mkdirSync(path.join(tempDir, 'en'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'es'), { recursive: true });

    fs.writeFileSync(
      path.join(tempDir, 'en', 'common.json'),
      JSON.stringify({ greeting: 'Hello' })
    );

    fs.writeFileSync(
      path.join(tempDir, 'es', 'common.json'),
      JSON.stringify({ greeting: 'Hola' })
    );
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('loads translations from directory structure', () => {
    const translations = loadTranslations(
      [path.join(tempDir, '**/*.json')],
      false
    );

    expect(translations).toHaveProperty('en');
    expect(translations).toHaveProperty('es');
    expect(translations.en.common).toEqual({ greeting: 'Hello' });
    expect(translations.es.common).toEqual({ greeting: 'Hola' });
  });

  it('handles non-existent paths gracefully', () => {
    const translations = loadTranslations(['/nonexistent/path/*.json'], false);
    expect(Object.keys(translations)).toHaveLength(0);
  });
});

describe('generateReport', () => {
  const tempDir = path.join(__dirname, '.temp-report-test');

  beforeAll(() => {
    fs.mkdirSync(path.join(tempDir, 'en'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'es'), { recursive: true });
    fs.mkdirSync(path.join(tempDir, 'fr'), { recursive: true });

    fs.writeFileSync(
      path.join(tempDir, 'en', 'common.json'),
      JSON.stringify({
        buttons: {
          submit: 'Submit',
          cancel: 'Cancel',
        },
        unused: 'Not used anywhere',
      })
    );

    fs.writeFileSync(
      path.join(tempDir, 'es', 'common.json'),
      JSON.stringify({
        buttons: {
          submit: 'Enviar',
          // cancel is missing
        },
      })
    );

    fs.writeFileSync(
      path.join(tempDir, 'fr', 'common.json'),
      JSON.stringify({
        buttons: {
          submit: 'Soumettre',
          cancel: 'Annuler',
        },
      })
    );
  });

  afterAll(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  const createKeys = (): ExtractedKey[] => [
    {
      key: 'common.buttons.submit',
      namespace: 'common',
      localKey: 'buttons.submit',
      file: 'Form.tsx',
      line: 10,
      column: 5,
      isDynamic: false,
    },
    {
      key: 'common.buttons.cancel',
      namespace: 'common',
      localKey: 'buttons.cancel',
      file: 'Form.tsx',
      line: 11,
      column: 5,
      isDynamic: false,
    },
    {
      key: '<dynamic>',
      namespace: 'common',
      localKey: '<dynamic>',
      file: 'Dynamic.tsx',
      line: 5,
      column: 0,
      isDynamic: true,
    },
  ];

  const createOptions = (): TranslatePluginOptions => ({
    translationFiles: [path.join(tempDir, '**/*.json')],
    defaultNamespace: 'common',
  });

  it('generates report with correct structure', () => {
    const report = generateReport(createKeys(), createOptions());

    expect(report).toHaveProperty('timestamp');
    expect(report).toHaveProperty('totalKeys');
    expect(report).toHaveProperty('extractedKeys');
    expect(report).toHaveProperty('dynamicKeys');
    expect(report).toHaveProperty('languages');
    expect(report).toHaveProperty('missing');
    expect(report).toHaveProperty('unused');
    expect(report).toHaveProperty('summary');
  });

  it('counts only static keys in totalKeys', () => {
    const report = generateReport(createKeys(), createOptions());

    expect(report.totalKeys).toBe(2); // Excludes dynamic key
  });

  it('separates static and dynamic keys', () => {
    const report = generateReport(createKeys(), createOptions());

    expect(report.extractedKeys).toHaveLength(2);
    expect(report.dynamicKeys).toHaveLength(1);
  });

  it('detects missing translations', () => {
    const report = generateReport(createKeys(), createOptions());

    // Spanish is missing 'cancel'
    expect(report.missing.es).toHaveLength(1);
    expect(report.missing.es[0].key).toBe('common.buttons.cancel');

    // English and French have all keys
    expect(report.missing.en).toHaveLength(0);
    expect(report.missing.fr).toHaveLength(0);
  });

  it('includes usage locations for missing keys', () => {
    const report = generateReport(createKeys(), createOptions());

    const missingCancel = report.missing.es[0];
    expect(missingCancel.usedIn).toHaveLength(1);
    expect(missingCancel.usedIn[0].file).toBe('Form.tsx');
    expect(missingCancel.usedIn[0].line).toBe(11);
  });

  it('detects unused translations', () => {
    const report = generateReport(createKeys(), createOptions());

    // 'unused' key exists in en/common.json but not in code
    expect(report.unused.en).toContain('common.unused');
  });

  it('calculates coverage percentages correctly', () => {
    const report = generateReport(createKeys(), createOptions());

    // English: 2/2 = 100%
    expect(report.summary.coveragePercent.en).toBe(100);

    // Spanish: 1/2 = 50%
    expect(report.summary.coveragePercent.es).toBe(50);

    // French: 2/2 = 100%
    expect(report.summary.coveragePercent.fr).toBe(100);
  });

  it('calculates summary totals', () => {
    const report = generateReport(createKeys(), createOptions());

    expect(report.summary.totalMissing).toBe(1); // Only Spanish missing 1
    expect(report.summary.totalUnused).toBeGreaterThan(0);
  });

  it('includes timestamp in ISO format', () => {
    const report = generateReport(createKeys(), createOptions());

    expect(() => new Date(report.timestamp)).not.toThrow();
    expect(report.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('handles empty keys array', () => {
    const report = generateReport([], createOptions());

    expect(report.totalKeys).toBe(0);
    expect(report.extractedKeys).toHaveLength(0);
    expect(report.summary.coveragePercent.en).toBe(100); // No keys = 100% coverage
  });

  it('handles keys with defaultValue', () => {
    const keysWithDefault: ExtractedKey[] = [
      {
        key: 'common.new.feature',
        namespace: 'common',
        localKey: 'new.feature',
        file: 'New.tsx',
        line: 1,
        column: 0,
        isDynamic: false,
        defaultValue: 'New Feature',
      },
    ];

    const report = generateReport(keysWithDefault, createOptions());

    const missingKey = report.missing.en.find(
      (m) => m.key === 'common.new.feature'
    );
    expect(missingKey?.defaultValue).toBe('New Feature');
  });
});

describe('writeReport', () => {
  const tempDir = path.join(__dirname, '.temp-write-test');

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('writes report to file', () => {
    const report = {
      timestamp: new Date().toISOString(),
      totalKeys: 0,
      extractedKeys: [],
      dynamicKeys: [],
      languages: ['en'],
      missing: { en: [] },
      unused: { en: [] },
      summary: {
        totalMissing: 0,
        totalUnused: 0,
        coveragePercent: { en: 100 },
      },
    };

    const outputPath = path.join(tempDir, 'report.json');
    writeReport(report, outputPath);

    expect(fs.existsSync(outputPath)).toBe(true);

    const written = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    expect(written).toEqual(report);
  });

  it('creates nested directories if needed', () => {
    const report = {
      timestamp: new Date().toISOString(),
      totalKeys: 0,
      extractedKeys: [],
      dynamicKeys: [],
      languages: [],
      missing: {},
      unused: {},
      summary: {
        totalMissing: 0,
        totalUnused: 0,
        coveragePercent: {},
      },
    };

    const outputPath = path.join(tempDir, 'deep', 'nested', 'report.json');
    writeReport(report, outputPath);

    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it('formats JSON with indentation', () => {
    const report = {
      timestamp: new Date().toISOString(),
      totalKeys: 1,
      extractedKeys: [],
      dynamicKeys: [],
      languages: ['en'],
      missing: { en: [] },
      unused: { en: [] },
      summary: {
        totalMissing: 0,
        totalUnused: 0,
        coveragePercent: { en: 100 },
      },
    };

    const outputPath = path.join(tempDir, 'formatted.json');
    writeReport(report, outputPath);

    const content = fs.readFileSync(outputPath, 'utf-8');
    expect(content).toContain('\n'); // Has newlines
    expect(content).toContain('  '); // Has indentation
  });
});
