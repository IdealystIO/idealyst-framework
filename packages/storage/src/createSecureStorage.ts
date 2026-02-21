import BaseStorage from './storage';
import type { SecureStorageOptions } from './types';

/**
 * Creates a secure storage instance with encrypted data at rest.
 *
 * Platform stub — replaced by `.web.ts` and `.native.ts` at build time.
 */
export function createSecureStorage(_options?: SecureStorageOptions): BaseStorage {
  throw new Error(
    'createSecureStorage is not available on this platform. ' +
    'Import from a platform-specific entry point.'
  );
}
