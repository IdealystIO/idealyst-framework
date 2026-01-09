import { parseKey, hasNestedKey, getNestedValue, flattenKeys } from '../namespace';

describe('parseKey', () => {
  it('parses namespace:key format', () => {
    expect(parseKey('common:greeting')).toEqual({
      namespace: 'common',
      localKey: 'greeting',
    });
  });

  it('parses namespace:nested.key format', () => {
    expect(parseKey('common:buttons.submit')).toEqual({
      namespace: 'common',
      localKey: 'buttons.submit',
    });
  });

  it('parses namespace.key format', () => {
    expect(parseKey('common.greeting')).toEqual({
      namespace: 'common',
      localKey: 'greeting',
    });
  });

  it('parses deeply nested namespace.a.b.c format', () => {
    expect(parseKey('common.buttons.primary.label')).toEqual({
      namespace: 'common',
      localKey: 'buttons.primary.label',
    });
  });

  it('uses default namespace for single key', () => {
    expect(parseKey('greeting')).toEqual({
      namespace: 'translation',
      localKey: 'greeting',
    });
  });

  it('uses custom default namespace', () => {
    expect(parseKey('greeting', 'app')).toEqual({
      namespace: 'app',
      localKey: 'greeting',
    });
  });

  it('handles multiple colons', () => {
    expect(parseKey('common:time:12:30')).toEqual({
      namespace: 'common',
      localKey: 'time:12:30',
    });
  });
});

describe('hasNestedKey', () => {
  const obj = {
    level1: {
      level2: {
        level3: 'value',
      },
      simple: 'test',
    },
    top: 'topValue',
  };

  it('returns true for existing top-level key', () => {
    expect(hasNestedKey(obj, 'top')).toBe(true);
  });

  it('returns true for existing nested key', () => {
    expect(hasNestedKey(obj, 'level1.level2.level3')).toBe(true);
  });

  it('returns true for intermediate key', () => {
    expect(hasNestedKey(obj, 'level1.level2')).toBe(true);
  });

  it('returns false for non-existent key', () => {
    expect(hasNestedKey(obj, 'nonexistent')).toBe(false);
  });

  it('returns false for non-existent nested key', () => {
    expect(hasNestedKey(obj, 'level1.nonexistent')).toBe(false);
  });

  it('returns false for path through non-object', () => {
    expect(hasNestedKey(obj, 'top.child')).toBe(false);
  });

  it('handles empty object', () => {
    expect(hasNestedKey({}, 'any')).toBe(false);
  });
});

describe('getNestedValue', () => {
  const obj = {
    greeting: 'Hello',
    nested: {
      deep: {
        value: 'Found it',
      },
    },
    array: [1, 2, 3],
  };

  it('gets top-level value', () => {
    expect(getNestedValue(obj, 'greeting')).toBe('Hello');
  });

  it('gets nested value', () => {
    expect(getNestedValue(obj, 'nested.deep.value')).toBe('Found it');
  });

  it('gets object value', () => {
    expect(getNestedValue(obj, 'nested.deep')).toEqual({ value: 'Found it' });
  });

  it('returns undefined for non-existent key', () => {
    expect(getNestedValue(obj, 'nonexistent')).toBeUndefined();
  });

  it('returns undefined for non-existent nested key', () => {
    expect(getNestedValue(obj, 'nested.nonexistent')).toBeUndefined();
  });

  it('handles array values', () => {
    expect(getNestedValue(obj, 'array')).toEqual([1, 2, 3]);
  });
});

describe('flattenKeys', () => {
  it('flattens simple object', () => {
    const obj = {
      a: 'value1',
      b: 'value2',
    };

    expect(flattenKeys(obj)).toEqual(['a', 'b']);
  });

  it('flattens nested object', () => {
    const obj = {
      buttons: {
        submit: 'Submit',
        cancel: 'Cancel',
      },
    };

    expect(flattenKeys(obj)).toEqual(['buttons.submit', 'buttons.cancel']);
  });

  it('flattens deeply nested object', () => {
    const obj = {
      forms: {
        validation: {
          errors: {
            required: 'Required',
            email: 'Invalid email',
          },
        },
      },
    };

    expect(flattenKeys(obj)).toEqual([
      'forms.validation.errors.required',
      'forms.validation.errors.email',
    ]);
  });

  it('uses prefix when provided', () => {
    const obj = {
      submit: 'Submit',
    };

    expect(flattenKeys(obj, 'buttons')).toEqual(['buttons.submit']);
  });

  it('handles mixed nesting levels', () => {
    const obj = {
      simple: 'value',
      nested: {
        deep: 'deepValue',
      },
    };

    expect(flattenKeys(obj)).toEqual(['simple', 'nested.deep']);
  });

  it('handles empty object', () => {
    expect(flattenKeys({})).toEqual([]);
  });

  it('ignores arrays (treats as leaf values)', () => {
    const obj = {
      items: ['a', 'b', 'c'],
    };

    expect(flattenKeys(obj)).toEqual(['items']);
  });

  it('handles null values', () => {
    const obj = {
      nullValue: null,
      valid: 'value',
    };

    expect(flattenKeys(obj as Record<string, unknown>)).toEqual([
      'nullValue',
      'valid',
    ]);
  });
});
