/**
 * Android Package Name generation utilities
 */

import { ValidationResult } from '../types';
import { PATTERNS, JAVA_RESERVED_KEYWORDS } from '../constants';

/**
 * Generate Android package name
 * Android does NOT allow hyphens - must be lowercase alphanumeric with dots
 *
 * @param orgDomain - Organization domain (e.g., "com.company")
 * @param projectName - Project name in kebab-case
 * @returns Android package name (hyphens removed)
 *
 * @example
 * generateAndroidPackageName('com.mycompany', 'my-app')
 * // Returns: 'com.mycompany.myapp'
 */
export function generateAndroidPackageName(orgDomain: string, projectName: string): string {
  // Normalize org domain
  const normalizedDomain = orgDomain.toLowerCase().replace(/\.+$/, '');

  // Normalize project name - remove hyphens for Android
  const normalizedName = projectName
    .toLowerCase()
    .replace(/-/g, '')  // Remove hyphens
    .replace(/[^a-z0-9]/g, ''); // Remove any other non-alphanumeric

  return `${normalizedDomain}.${normalizedName}`;
}

/**
 * Validate Android package name format
 */
export function validateAndroidPackageName(packageName: string): ValidationResult {
  // Must be all lowercase with dots separating segments
  if (!PATTERNS.ANDROID_PACKAGE.test(packageName)) {
    return {
      valid: false,
      error: 'Package name must be lowercase, start with letter, and have dot-separated segments',
    };
  }

  // Check for reserved keywords
  const segments = packageName.split('.');
  for (const segment of segments) {
    if (JAVA_RESERVED_KEYWORDS.includes(segment as typeof JAVA_RESERVED_KEYWORDS[number])) {
      return {
        valid: false,
        error: `"${segment}" is a Java reserved keyword and cannot be used`,
        suggestions: [`Change "${segment}" to something else like "${segment}app"`],
      };
    }
  }

  // Each segment must not be empty
  for (const segment of segments) {
    if (segment.length === 0) {
      return {
        valid: false,
        error: 'Package name segments cannot be empty',
      };
    }
  }

  return { valid: true };
}

/**
 * Convert a kebab-case string to a valid Android package segment
 * Removes hyphens and ensures lowercase
 */
export function toAndroidSegment(input: string): string {
  return input
    .toLowerCase()
    .replace(/-/g, '')
    .replace(/[^a-z0-9]/g, '');
}
