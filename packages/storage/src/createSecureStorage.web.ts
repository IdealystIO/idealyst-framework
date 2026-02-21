import BaseStorage from './storage';
import WebSecureStorage from './secure-storage.web';
import type { SecureStorageOptions } from './types';

/**
 * Creates a secure storage instance using AES-GCM encryption via the Web Crypto API.
 * Encryption keys are stored as non-extractable CryptoKeys in IndexedDB.
 * Encrypted values are persisted in localStorage.
 */
export function createSecureStorage(options?: SecureStorageOptions): BaseStorage {
  return new BaseStorage(new WebSecureStorage(options));
}
