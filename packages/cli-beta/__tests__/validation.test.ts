/**
 * Tests for input validation utilities
 */

import {
  validateProjectName,
  validateOrgDomain,
  validateAppDisplayName,
  validateBundleId,
  validateAndroidPackageName,
  validateExtensions,
} from '../src/utils/validation';

describe('Validation Utilities', () => {
  describe('validateProjectName', () => {
    describe('valid names', () => {
      it('should accept lowercase letters', () => {
        expect(validateProjectName('myapp').valid).toBe(true);
      });

      it('should accept letters with numbers', () => {
        expect(validateProjectName('myapp123').valid).toBe(true);
      });

      it('should accept letters with hyphens', () => {
        expect(validateProjectName('my-cool-app').valid).toBe(true);
      });

      it('should accept minimum length (2 chars)', () => {
        expect(validateProjectName('ab').valid).toBe(true);
      });
    });

    describe('invalid names', () => {
      it('should reject uppercase letters', () => {
        const result = validateProjectName('MyApp');
        expect(result.valid).toBe(false);
      });

      it('should reject names starting with number', () => {
        const result = validateProjectName('123app');
        expect(result.valid).toBe(false);
      });

      it('should reject names starting with hyphen', () => {
        const result = validateProjectName('-myapp');
        expect(result.valid).toBe(false);
      });

      it('should reject names with underscores', () => {
        const result = validateProjectName('my_app');
        expect(result.valid).toBe(false);
      });

      it('should reject names with spaces', () => {
        const result = validateProjectName('my app');
        expect(result.valid).toBe(false);
      });

      it('should reject names shorter than 2 chars', () => {
        const result = validateProjectName('a');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('at least 2 characters');
      });

      it('should reject names longer than 50 chars', () => {
        const longName = 'a'.repeat(51);
        const result = validateProjectName(longName);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('50 characters or less');
      });

      it('should provide suggestions for invalid names', () => {
        const result = validateProjectName('MyApp');
        expect(result.suggestions).toBeDefined();
        expect(result.suggestions!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('validateOrgDomain', () => {
    describe('valid domains', () => {
      it('should accept two-segment domains', () => {
        expect(validateOrgDomain('com.company').valid).toBe(true);
      });

      it('should accept three-segment domains', () => {
        expect(validateOrgDomain('com.company.apps').valid).toBe(true);
      });

      it('should accept domains with numbers', () => {
        expect(validateOrgDomain('com.company123').valid).toBe(true);
      });

      it('should accept io TLD', () => {
        expect(validateOrgDomain('io.myapp').valid).toBe(true);
      });

      it('should accept org TLD', () => {
        expect(validateOrgDomain('org.opensource').valid).toBe(true);
      });
    });

    describe('invalid domains', () => {
      it('should reject uppercase letters', () => {
        const result = validateOrgDomain('com.Company');
        expect(result.valid).toBe(false);
      });

      it('should reject single segment', () => {
        const result = validateOrgDomain('company');
        expect(result.valid).toBe(false);
        // The pattern check fails first, so error is about dot-separated format
        expect(result.error).toContain('dot-separated');
      });

      it('should reject domains with hyphens', () => {
        const result = validateOrgDomain('com.my-company');
        expect(result.valid).toBe(false);
      });

      it('should reject domains starting with number', () => {
        const result = validateOrgDomain('123.company');
        expect(result.valid).toBe(false);
      });

      it('should reject Java reserved keywords', () => {
        const result = validateOrgDomain('com.class');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('reserved keyword');
      });

      it('should reject multiple Java reserved keywords', () => {
        expect(validateOrgDomain('com.public').valid).toBe(false);
        expect(validateOrgDomain('com.static').valid).toBe(false);
        expect(validateOrgDomain('com.interface').valid).toBe(false);
      });

      it('should provide suggestions for invalid domains', () => {
        const result = validateOrgDomain('com.class');
        expect(result.suggestions).toBeDefined();
      });
    });
  });

  describe('validateAppDisplayName', () => {
    describe('valid names', () => {
      it('should accept simple names', () => {
        expect(validateAppDisplayName('My App').valid).toBe(true);
      });

      it('should accept names with numbers', () => {
        expect(validateAppDisplayName('App 2.0').valid).toBe(true);
      });

      it('should accept names with special characters', () => {
        expect(validateAppDisplayName("John's App").valid).toBe(true);
      });

      it('should accept single word names', () => {
        expect(validateAppDisplayName('Idealyst').valid).toBe(true);
      });
    });

    describe('invalid names', () => {
      it('should reject empty string', () => {
        const result = validateAppDisplayName('');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('cannot be empty');
      });

      it('should reject whitespace only', () => {
        const result = validateAppDisplayName('   ');
        expect(result.valid).toBe(false);
      });

      it('should reject names longer than 50 chars', () => {
        const longName = 'A'.repeat(51);
        const result = validateAppDisplayName(longName);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('50 characters or less');
      });

      it('should reject names without any letters', () => {
        const result = validateAppDisplayName('123456');
        expect(result.valid).toBe(false);
        expect(result.error).toContain('at least one letter');
      });
    });
  });

  describe('validateBundleId', () => {
    describe('valid bundle IDs', () => {
      it('should accept standard bundle IDs', () => {
        expect(validateBundleId('com.company.app').valid).toBe(true);
      });

      it('should accept bundle IDs with hyphens', () => {
        expect(validateBundleId('com.company.my-app').valid).toBe(true);
      });

      it('should accept bundle IDs with numbers', () => {
        expect(validateBundleId('com.company.app123').valid).toBe(true);
      });
    });

    describe('invalid bundle IDs', () => {
      it('should reject IDs not starting with letter', () => {
        const result = validateBundleId('123.company.app');
        expect(result.valid).toBe(false);
      });

      it('should reject IDs with less than two segments', () => {
        const result = validateBundleId('singleword');
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('validateAndroidPackageName', () => {
    describe('valid package names', () => {
      it('should accept standard package names', () => {
        expect(validateAndroidPackageName('com.company.app').valid).toBe(true);
      });

      it('should accept package names with numbers', () => {
        expect(validateAndroidPackageName('com.company.app123').valid).toBe(true);
      });
    });

    describe('invalid package names', () => {
      it('should reject package names with hyphens', () => {
        const result = validateAndroidPackageName('com.company.my-app');
        expect(result.valid).toBe(false);
      });

      it('should reject package names with uppercase', () => {
        const result = validateAndroidPackageName('com.Company.app');
        expect(result.valid).toBe(false);
      });

      it('should reject Java reserved keywords', () => {
        const result = validateAndroidPackageName('com.class.app');
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('validateExtensions', () => {
    it('should accept valid extension combinations', () => {
      expect(validateExtensions({}).valid).toBe(true);
      expect(validateExtensions({ withApi: true }).valid).toBe(true);
      expect(validateExtensions({ withApi: true, withTrpc: true }).valid).toBe(true);
      expect(validateExtensions({ withApi: true, withGraphql: true }).valid).toBe(true);
      expect(validateExtensions({ withApi: true, withTrpc: true, withGraphql: true }).valid).toBe(true);
    });

    it('should reject tRPC without API', () => {
      const result = validateExtensions({ withTrpc: true });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('tRPC requires API');
    });

    it('should reject GraphQL without API', () => {
      const result = validateExtensions({ withGraphql: true });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('GraphQL requires API');
    });

    it('should provide suggestions for invalid combinations', () => {
      const result = validateExtensions({ withTrpc: true });
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions!.some(s => s.includes('--with-api'))).toBe(true);
    });
  });
});
