import { KeyRegistry, parseKey, extractKeysFromSource } from '../extractor';

describe('parseKey', () => {
  it('parses namespace:key format', () => {
    const result = parseKey('common:buttons.submit');
    expect(result).toEqual({
      namespace: 'common',
      localKey: 'buttons.submit',
    });
  });

  it('parses namespace.key format (first segment as namespace)', () => {
    const result = parseKey('common.buttons.submit');
    expect(result).toEqual({
      namespace: 'common',
      localKey: 'buttons.submit',
    });
  });

  it('uses default namespace for single key', () => {
    const result = parseKey('submit', 'translation');
    expect(result).toEqual({
      namespace: 'translation',
      localKey: 'submit',
    });
  });

  it('handles deeply nested keys', () => {
    const result = parseKey('common.forms.validation.errors.required');
    expect(result).toEqual({
      namespace: 'common',
      localKey: 'forms.validation.errors.required',
    });
  });

  it('handles colon in local key', () => {
    const result = parseKey('common:time:format');
    expect(result).toEqual({
      namespace: 'common',
      localKey: 'time:format',
    });
  });
});

describe('KeyRegistry', () => {
  let registry: KeyRegistry;

  beforeEach(() => {
    registry = new KeyRegistry();
  });

  it('adds and retrieves keys', () => {
    registry.addKey({
      key: 'common.test',
      namespace: 'common',
      localKey: 'test',
      file: 'test.tsx',
      line: 1,
      column: 0,
      isDynamic: false,
    });

    expect(registry.getKeyCount()).toBe(1);
    expect(registry.hasKey('common.test')).toBe(true);
  });

  it('tracks multiple usages of the same key', () => {
    const baseKey = {
      key: 'common.test',
      namespace: 'common',
      localKey: 'test',
      isDynamic: false,
    };

    registry.addKey({ ...baseKey, file: 'file1.tsx', line: 1, column: 0 });
    registry.addKey({ ...baseKey, file: 'file2.tsx', line: 5, column: 0 });

    const usages = registry.getKeyUsages('common.test');
    expect(usages).toHaveLength(2);
    expect(usages[0].file).toBe('file1.tsx');
    expect(usages[1].file).toBe('file2.tsx');
  });

  it('separates static and dynamic keys', () => {
    registry.addKey({
      key: 'common.static',
      namespace: 'common',
      localKey: 'static',
      file: 'test.tsx',
      line: 1,
      column: 0,
      isDynamic: false,
    });

    registry.addKey({
      key: '<dynamic>',
      namespace: 'common',
      localKey: '<dynamic>',
      file: 'test.tsx',
      line: 2,
      column: 0,
      isDynamic: true,
    });

    expect(registry.getStaticKeys()).toHaveLength(1);
    expect(registry.getDynamicKeys()).toHaveLength(1);
  });

  it('returns unique keys', () => {
    const baseKey = {
      key: 'common.test',
      namespace: 'common',
      localKey: 'test',
      isDynamic: false,
    };

    registry.addKey({ ...baseKey, file: 'file1.tsx', line: 1, column: 0 });
    registry.addKey({ ...baseKey, file: 'file2.tsx', line: 5, column: 0 });

    const uniqueKeys = registry.getUniqueKeys();
    expect(uniqueKeys).toHaveLength(1);
    expect(uniqueKeys[0]).toBe('common.test');
  });

  it('groups keys by namespace', () => {
    registry.addKey({
      key: 'common.test1',
      namespace: 'common',
      localKey: 'test1',
      file: 'test.tsx',
      line: 1,
      column: 0,
      isDynamic: false,
    });

    registry.addKey({
      key: 'auth.login',
      namespace: 'auth',
      localKey: 'login',
      file: 'test.tsx',
      line: 2,
      column: 0,
      isDynamic: false,
    });

    const byNamespace = registry.getKeysByNamespace();
    expect(Object.keys(byNamespace)).toEqual(['common', 'auth']);
    expect(byNamespace.common).toHaveLength(1);
    expect(byNamespace.auth).toHaveLength(1);
  });

  it('clears all keys', () => {
    registry.addKey({
      key: 'common.test',
      namespace: 'common',
      localKey: 'test',
      file: 'test.tsx',
      line: 1,
      column: 0,
      isDynamic: false,
    });

    registry.clear();
    expect(registry.getKeyCount()).toBe(0);
  });
});

describe('extractKeysFromSource', () => {
  it('extracts t() calls with single quotes', () => {
    const code = `const label = t('common.buttons.submit');`;
    const keys = extractKeysFromSource(code, 'test.tsx');

    expect(keys).toHaveLength(1);
    expect(keys[0].key).toBe('common.buttons.submit');
    expect(keys[0].namespace).toBe('common');
    expect(keys[0].localKey).toBe('buttons.submit');
  });

  it('extracts t() calls with double quotes', () => {
    const code = `const label = t("common.buttons.submit");`;
    const keys = extractKeysFromSource(code, 'test.tsx');

    expect(keys).toHaveLength(1);
    expect(keys[0].key).toBe('common.buttons.submit');
  });

  it('extracts multiple t() calls', () => {
    const code = `
      const submit = t('common.buttons.submit');
      const cancel = t('common.buttons.cancel');
    `;
    const keys = extractKeysFromSource(code, 'test.tsx');

    expect(keys).toHaveLength(2);
    expect(keys[0].key).toBe('common.buttons.submit');
    expect(keys[1].key).toBe('common.buttons.cancel');
  });

  it('extracts Trans component i18nKey', () => {
    const code = `<Trans i18nKey="common.richText" />`;
    const keys = extractKeysFromSource(code, 'test.tsx');

    expect(keys).toHaveLength(1);
    expect(keys[0].key).toBe('common.richText');
  });

  it('extracts both t() and Trans keys', () => {
    const code = `
      const label = t('common.title');
      return <Trans i18nKey="common.description" />;
    `;
    const keys = extractKeysFromSource(code, 'test.tsx');

    expect(keys).toHaveLength(2);
  });

  it('includes line numbers', () => {
    const code = `const label = t('common.test');`;
    const keys = extractKeysFromSource(code, 'test.tsx');

    expect(keys[0].line).toBe(1);
    expect(keys[0].file).toBe('test.tsx');
  });
});
