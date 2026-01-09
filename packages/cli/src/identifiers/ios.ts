/**
 * iOS Bundle ID generation utilities
 */

import { ValidationResult } from '../types';
import { PATTERNS } from '../constants';

/**
 * Generate iOS bundle identifier
 * iOS allows hyphens in bundle IDs
 *
 * @param orgDomain - Organization domain (e.g., "com.company")
 * @param projectName - Project name in kebab-case
 * @returns iOS bundle identifier
 *
 * @example
 * generateIosBundleId('com.mycompany', 'my-app')
 * // Returns: 'com.mycompany.my-app'
 */
export function generateIosBundleId(orgDomain: string, projectName: string): string {
  // Normalize org domain (ensure lowercase, no trailing dots)
  const normalizedDomain = orgDomain.toLowerCase().replace(/\.+$/, '');

  // Normalize project name (lowercase, keep hyphens)
  const normalizedName = projectName.toLowerCase();

  return `${normalizedDomain}.${normalizedName}`;
}

/**
 * Validate iOS bundle ID format
 */
export function validateIosBundleId(bundleId: string): ValidationResult {
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

  // Must have at least two segments (e.g., com.app)
  const segments = bundleId.split('.');
  if (segments.length < 2) {
    return {
      valid: false,
      error: 'Bundle ID must have at least two segments (e.g., com.app)',
    };
  }

  // Each segment must not be empty
  for (const segment of segments) {
    if (segment.length === 0) {
      return {
        valid: false,
        error: 'Bundle ID segments cannot be empty',
      };
    }
  }

  return { valid: true };
}
