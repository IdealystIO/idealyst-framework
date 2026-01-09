/**
 * Tests for mobile identifier generation
 */

import {
  generateIdentifiers,
  generateIosBundleId,
  generateAndroidPackageName,
  validateIosBundleId,
  validateAndroidPackageName,
} from '../src/identifiers';

describe('Mobile Identifiers', () => {
  describe('generateIdentifiers', () => {
    it('should generate both iOS and Android identifiers', () => {
      const result = generateIdentifiers('com.company', 'my-app');

      expect(result).toHaveProperty('iosBundleId');
      expect(result).toHaveProperty('androidPackageName');
    });

    it('should generate correct identifiers for standard input', () => {
      const result = generateIdentifiers('com.mycompany', 'awesome-app');

      expect(result.iosBundleId).toBe('com.mycompany.awesome-app');
      expect(result.androidPackageName).toBe('com.mycompany.awesomeapp');
    });

    it('should handle different TLDs', () => {
      const result = generateIdentifiers('io.startup', 'cool-thing');

      expect(result.iosBundleId).toBe('io.startup.cool-thing');
      expect(result.androidPackageName).toBe('io.startup.coolthing');
    });

    it('should handle three-segment domains', () => {
      const result = generateIdentifiers('com.example.apps', 'my-app');

      expect(result.iosBundleId).toBe('com.example.apps.my-app');
      expect(result.androidPackageName).toBe('com.example.apps.myapp');
    });
  });

  describe('generateIosBundleId', () => {
    it('should preserve hyphens in project name', () => {
      const bundleId = generateIosBundleId('com.test', 'my-cool-app');
      expect(bundleId).toBe('com.test.my-cool-app');
    });

    it('should lowercase everything', () => {
      const bundleId = generateIosBundleId('COM.TEST', 'MY-APP');
      expect(bundleId).toBe('com.test.my-app');
    });

    it('should remove trailing dots from domain', () => {
      const bundleId = generateIosBundleId('com.test.', 'myapp');
      expect(bundleId).toBe('com.test.myapp');
    });

    it('should handle single-word project names', () => {
      const bundleId = generateIosBundleId('com.company', 'myapp');
      expect(bundleId).toBe('com.company.myapp');
    });
  });

  describe('generateAndroidPackageName', () => {
    it('should remove hyphens from project name', () => {
      const packageName = generateAndroidPackageName('com.test', 'my-cool-app');
      expect(packageName).toBe('com.test.mycoolapp');
    });

    it('should lowercase everything', () => {
      const packageName = generateAndroidPackageName('COM.TEST', 'MYAPP');
      expect(packageName).toBe('com.test.myapp');
    });

    it('should remove special characters', () => {
      const packageName = generateAndroidPackageName('com.test', 'my_app@123');
      expect(packageName).toBe('com.test.myapp123');
    });

    it('should handle multiple hyphens', () => {
      const packageName = generateAndroidPackageName('com.test', 'my-super-cool-app');
      expect(packageName).toBe('com.test.mysupercoolapp');
    });
  });

  describe('validateIosBundleId', () => {
    it('should accept valid bundle IDs', () => {
      expect(validateIosBundleId('com.company.app').valid).toBe(true);
      expect(validateIosBundleId('com.company.my-app').valid).toBe(true);
      expect(validateIosBundleId('io.startup.app123').valid).toBe(true);
    });

    it('should reject bundle IDs not starting with letter', () => {
      const result = validateIosBundleId('123.company.app');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('start with a letter');
    });

    it('should reject bundle IDs with invalid characters', () => {
      const result = validateIosBundleId('com.company.app@test');
      expect(result.valid).toBe(false);
    });

    it('should reject bundle IDs with less than two segments', () => {
      const result = validateIosBundleId('singleword');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('two segments');
    });
  });

  describe('validateAndroidPackageName', () => {
    it('should accept valid package names', () => {
      expect(validateAndroidPackageName('com.company.app').valid).toBe(true);
      expect(validateAndroidPackageName('io.startup.myapp123').valid).toBe(true);
    });

    it('should reject package names with hyphens', () => {
      const result = validateAndroidPackageName('com.company.my-app');
      expect(result.valid).toBe(false);
    });

    it('should reject package names with uppercase', () => {
      const result = validateAndroidPackageName('com.Company.App');
      expect(result.valid).toBe(false);
    });

    it('should reject Java reserved keywords', () => {
      const result = validateAndroidPackageName('com.class.app');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('reserved keyword');
    });

    it('should reject multiple Java reserved keywords', () => {
      expect(validateAndroidPackageName('com.public.app').valid).toBe(false);
      expect(validateAndroidPackageName('com.company.static').valid).toBe(false);
      expect(validateAndroidPackageName('com.interface.void').valid).toBe(false);
    });
  });
});
