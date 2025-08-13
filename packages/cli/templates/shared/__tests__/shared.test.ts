import { add_stuff } from '../src/index';

describe('Shared Library', () => {
  it('should export add_stuff', () => {
    expect(add_stuff).toBeDefined();
    expect(typeof add_stuff).toBe('string');
    expect(add_stuff).toBe('here');
  });
});

describe('Sample Shared Tests', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string operations', () => {
    const testString = 'Hello World';
    expect(testString).toContain('World');
    expect(testString.length).toBe(11);
  });

  it('should work with objects', () => {
    const testObj = { name: 'test', value: 42 };
    expect(testObj).toHaveProperty('name');
    expect(testObj).toHaveProperty('value', 42);
  });

  it('should handle arrays', () => {
    const testArray = [1, 2, 3, 4, 5];
    expect(testArray).toHaveLength(5);
    expect(testArray).toContain(3);
    expect(testArray.filter(x => x > 3)).toEqual([4, 5]);
  });

  it('should work with async operations', async () => {
    const result = await Promise.resolve('async test');
    expect(result).toBe('async test');
  });
});
