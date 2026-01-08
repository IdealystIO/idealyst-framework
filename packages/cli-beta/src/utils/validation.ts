/**
 * Input validation utilities
 */

import validateNpmPackageName from 'validate-npm-package-name';
import { PATTERNS, JAVA_RESERVED_KEYWORDS } from '../constants';
import { ValidationResult } from '../types';

/**
 * Validate a project name
 */
export function validateProjectName(name: string): ValidationResult {
  // Check npm package name validity
  const npmResult = validateNpmPackageName(name);
  if (!npmResult.validForNewPackages) {
    const errors = [...(npmResult.errors || []), ...(npmResult.warnings || [])];
    return {
      valid: false,
      error: errors.join(', '),
      suggestions: [
        'Use lowercase letters, numbers, and hyphens only',
        'Start with a letter',
        'Example: my-awesome-app',
      ],
    };
  }

  // Check our additional constraints
  if (!PATTERNS.PROJECT_NAME.test(name)) {
    return {
      valid: false,
      error: 'Project name must be lowercase and start with a letter',
      suggestions: [
        'Use only lowercase letters, numbers, and hyphens',
        'Start with a letter',
        'Example: my-awesome-app',
      ],
    };
  }

  // Check length
  if (name.length < 2) {
    return {
      valid: false,
      error: 'Project name must be at least 2 characters',
    };
  }

  if (name.length > 50) {
    return {
      valid: false,
      error: 'Project name must be 50 characters or less',
    };
  }

  return { valid: true };
}

/**
 * Validate an organization domain
 */
export function validateOrgDomain(domain: string): ValidationResult {
  // Check basic format
  if (!PATTERNS.ORG_DOMAIN.test(domain)) {
    return {
      valid: false,
      error: 'Domain must be lowercase with dot-separated segments',
      suggestions: [
        'Use format like: com.company or io.myorg',
        'Each segment must start with a letter',
        'Only lowercase letters and numbers allowed',
      ],
    };
  }

  // Check for at least two segments
  const segments = domain.split('.');
  if (segments.length < 2) {
    return {
      valid: false,
      error: 'Domain must have at least two segments',
      suggestions: ['Example: com.company, io.myorg, org.example'],
    };
  }

  // Check for Java reserved keywords
  for (const segment of segments) {
    if (JAVA_RESERVED_KEYWORDS.includes(segment as typeof JAVA_RESERVED_KEYWORDS[number])) {
      return {
        valid: false,
        error: `"${segment}" is a Java reserved keyword and cannot be used`,
        suggestions: [`Change "${segment}" to something else like "${segment}app"`],
      };
    }
  }

  return { valid: true };
}

/**
 * Validate an app display name
 */
export function validateAppDisplayName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: 'App name cannot be empty',
    };
  }

  if (name.length > 50) {
    return {
      valid: false,
      error: 'App name must be 50 characters or less',
    };
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(name)) {
    return {
      valid: false,
      error: 'App name must contain at least one letter',
    };
  }

  return { valid: true };
}

/**
 * Validate an iOS bundle ID
 */
export function validateBundleId(bundleId: string): ValidationResult {
  // Must start with letter
  if (!/^[a-zA-Z]/.test(bundleId)) {
    return {
      valid: false,
      error: 'Bundle ID must start with a letter',
    };
  }

  // Only alphanumeric, dots, and hyphens
  if (!PATTERNS.IOS_BUNDLE_ID.test(bundleId)) {
    return {
      valid: false,
      error: 'Bundle ID can only contain letters, numbers, dots, and hyphens',
    };
  }

  // Must have at least two segments
  const segments = bundleId.split('.');
  if (segments.length < 2) {
    return {
      valid: false,
      error: 'Bundle ID must have at least two segments (e.g., com.app)',
    };
  }

  return { valid: true };
}

/**
 * Validate an Android package name
 */
export function validateAndroidPackageName(packageName: string): ValidationResult {
  // Must be lowercase with dots separating segments
  if (!PATTERNS.ANDROID_PACKAGE.test(packageName)) {
    return {
      valid: false,
      error: 'Package name must be lowercase, start with letter, and have dot-separated segments',
    };
  }

  // Check for Java reserved keywords
  const segments = packageName.split('.');
  for (const segment of segments) {
    if (JAVA_RESERVED_KEYWORDS.includes(segment as typeof JAVA_RESERVED_KEYWORDS[number])) {
      return {
        valid: false,
        error: `"${segment}" is a Java reserved keyword`,
      };
    }
  }

  return { valid: true };
}

/**
 * Validate that extension dependencies are met
 */
export function validateExtensions(options: {
  withApi?: boolean;
  withTrpc?: boolean;
  withGraphql?: boolean;
}): ValidationResult {
  const { withApi, withTrpc, withGraphql } = options;

  if (withTrpc && !withApi) {
    return {
      valid: false,
      error: 'tRPC requires API to be enabled',
      suggestions: ['Add --with-api flag to enable API server'],
    };
  }

  if (withGraphql && !withApi) {
    return {
      valid: false,
      error: 'GraphQL requires API to be enabled',
      suggestions: ['Add --with-api flag to enable API server'],
    };
  }

  return { valid: true };
}
