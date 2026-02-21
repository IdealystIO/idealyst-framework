import { createMMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';
import { IStorage, SecureStorageOptions } from './types';

const KEY_USERNAME = '__mmkv_encryption_key__';

class NativeSecureStorage implements IStorage {
  private prefix: string;
  private mmkv: ReturnType<typeof createMMKV> | null = null;
  private initPromise: Promise<void> | null = null;

  constructor(options: SecureStorageOptions = {}) {
    this.prefix = options.prefix ?? 'secure';
  }

  private async ensureInitialized(): Promise<ReturnType<typeof createMMKV>> {
    if (this.mmkv) return this.mmkv;
    if (!this.initPromise) {
      this.initPromise = this._init();
    }
    await this.initPromise;
    return this.mmkv!;
  }

  private async _init(): Promise<void> {
    const service = `${this.prefix}_keychain`;

    let encryptionKey: string;
    const credentials = await Keychain.getGenericPassword({ service });

    if (credentials && credentials.password) {
      encryptionKey = credentials.password;
    } else {
      // Generate a random 16-byte key (MMKV max encryptionKey length is 16 bytes)
      const randomBytes = new Uint8Array(16);
      globalThis.crypto.getRandomValues(randomBytes);
      encryptionKey = String.fromCharCode(...randomBytes);

      await Keychain.setGenericPassword(KEY_USERNAME, encryptionKey, {
        service,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    }

    this.mmkv = createMMKV({
      id: `${this.prefix}_secure_mmkv`,
      encryptionKey,
    });
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const storage = await this.ensureInitialized();
      return storage.getString(key) || null;
    } catch (error) {
      console.error('Error getting item from secure storage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const storage = await this.ensureInitialized();
      storage.set(key, value);
    } catch (error) {
      console.error('Error setting item in secure storage:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const storage = await this.ensureInitialized();
      storage.remove(key);
    } catch (error) {
      console.error('Error removing item from secure storage:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const storage = await this.ensureInitialized();
      storage.clearAll();
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const storage = await this.ensureInitialized();
      return storage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from secure storage:', error);
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      const storage = await this.ensureInitialized();
      return keys.map(key => [key, storage.getString(key) || null]);
    } catch (error) {
      console.error('Error in multiGet from secure storage:', error);
      return keys.map(key => [key, null]);
    }
  }

  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      const storage = await this.ensureInitialized();
      keyValuePairs.forEach(([key, value]) => {
        storage.set(key, value);
      });
    } catch (error) {
      console.error('Error in multiSet to secure storage:', error);
      throw error;
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      const storage = await this.ensureInitialized();
      keys.forEach(key => {
        storage.remove(key);
      });
    } catch (error) {
      console.error('Error in multiRemove from secure storage:', error);
      throw error;
    }
  }
}

export default NativeSecureStorage;
