import validatePackageName from 'validate-npm-package-name';

// Simple utility functions for testing
function validateProjectName(name: string): boolean {
  const validation = validatePackageName(name);
  return validation.validForNewPackages;
}

function createPackageName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

describe('CLI Validation (Simple)', () => {
  describe('validateProjectName', () => {
    test('should accept valid package names', () => {
      expect(validateProjectName('my-app')).toBe(true);
      expect(validateProjectName('myapp')).toBe(true);
      expect(validateProjectName('my-awesome-app')).toBe(true);
      expect(validateProjectName('app123')).toBe(true);
      expect(validateProjectName('a')).toBe(true);
    });

    test('should reject invalid package names', () => {
      expect(validateProjectName('My App')).toBe(false); // spaces
      expect(validateProjectName('MY-APP')).toBe(false); // uppercase
      expect(validateProjectName('my_app')).toBe(false); // underscore
      expect(validateProjectName('my@app')).toBe(false); // special characters
      expect(validateProjectName('123app')).toBe(false); // starts with number
      expect(validateProjectName('')).toBe(false); // empty string
      expect(validateProjectName('node')).toBe(false); // reserved name
      expect(validateProjectName('.myapp')).toBe(false); // starts with dot
    });

    test('should handle edge cases', () => {
      expect(validateProjectName('a'.repeat(214))).toBe(false); // too long
      expect(validateProjectName('my-app-with-very-long-name')).toBe(true);
    });
  });

  describe('createPackageName', () => {
    test('should convert names to valid package names', () => {
      expect(createPackageName('My App')).toBe('my-app');
      expect(createPackageName('MY_AWESOME_APP')).toBe('my-awesome-app');
      expect(createPackageName('App@123')).toBe('app-123');
      expect(createPackageName('  My   App  ')).toBe('--my---app--');
    });

    test('should handle special characters', () => {
      expect(createPackageName('my@app#test')).toBe('my-app-test');
      expect(createPackageName('app.with.dots')).toBe('app-with-dots');
      expect(createPackageName('app_with_underscores')).toBe('app-with-underscores');
    });

    test('should preserve valid names', () => {
      expect(createPackageName('my-app')).toBe('my-app');
      expect(createPackageName('myapp')).toBe('myapp');
      expect(createPackageName('app123')).toBe('app123');
    });
  });
}); 