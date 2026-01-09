/**
 * Wizard input validators
 */

import { ValidationResult } from '../types';
import {
  validateProjectName,
  validateOrgDomain,
  validateAppDisplayName,
} from '../utils/validation';

/**
 * Re-export validators for use in wizard steps
 */
export {
  validateProjectName,
  validateOrgDomain,
  validateAppDisplayName,
};

/**
 * Validate a boolean input
 */
export function validateBoolean(value: unknown): ValidationResult {
  if (typeof value !== 'boolean') {
    return {
      valid: false,
      error: 'Please select Yes or No',
    };
  }
  return { valid: true };
}

/**
 * Display validation error to user
 */
export function formatValidationError(result: ValidationResult): string {
  let message = result.error || 'Invalid input';

  if (result.suggestions && result.suggestions.length > 0) {
    message += '\n' + result.suggestions.map(s => `  • ${s}`).join('\n');
  }

  return message;
}
