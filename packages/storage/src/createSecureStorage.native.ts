import BaseStorage from './storage';
import NativeSecureStorage from './secure-storage.native';
import type { SecureStorageOptions } from './types';

/**
 * Creates a secure storage instance using encrypted MMKV backed by the OS Keychain.
 * The MMKV encryption key is stored in the iOS Keychain / Android Keystore.
 */
export function createSecureStorage(options?: SecureStorageOptions): BaseStorage {
  return new BaseStorage(new NativeSecureStorage(options));
}
