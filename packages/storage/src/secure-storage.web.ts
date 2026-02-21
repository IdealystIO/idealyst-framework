import { IStorage, SecureStorageOptions } from './types';

const DB_NAME = 'idealyst_secure_storage';
const DB_VERSION = 1;
const STORE_NAME = 'crypto_keys';
const IV_LENGTH = 12;

class WebSecureStorage implements IStorage {
  private prefix: string;
  private cryptoKey: CryptoKey | null = null;
  private initPromise: Promise<void> | null = null;

  constructor(options: SecureStorageOptions = {}) {
    this.prefix = options.prefix ?? 'secure';
  }

  private async ensureInitialized(): Promise<CryptoKey> {
    if (this.cryptoKey) return this.cryptoKey;
    if (!this.initPromise) {
      this.initPromise = this._init();
    }
    await this.initPromise;
    return this.cryptoKey!;
  }

  private async _init(): Promise<void> {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error(
        'Secure storage requires the Web Crypto API (crypto.subtle). ' +
        'Ensure you are running in a secure context (HTTPS).'
      );
    }

    const db = await this.openDB();
    const keyName = `${this.prefix}_aes_key`;

    const existingKey = await this.getKeyFromDB(db, keyName);
    if (existingKey) {
      this.cryptoKey = existingKey;
      db.close();
      return;
    }

    this.cryptoKey = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    await this.putKeyInDB(db, keyName, this.cryptoKey);
    db.close();
  }

  private async encrypt(plaintext: string): Promise<string> {
    const key = await this.ensureInitialized();
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  private async decrypt(stored: string): Promise<string> {
    const key = await this.ensureInitialized();
    const combined = Uint8Array.from(atob(stored), c => c.charCodeAt(0));

    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }

  private storageKey(key: string): string {
    return `__secure_${this.prefix}_${key}`;
  }

  private storageKeyPrefix(): string {
    return `__secure_${this.prefix}_`;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const stored = localStorage.getItem(this.storageKey(key));
      if (stored === null) return null;
      return await this.decrypt(stored);
    } catch (error) {
      console.error('Error getting item from secure storage:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = await this.encrypt(value);
      localStorage.setItem(this.storageKey(key), encrypted);
    } catch (error) {
      console.error('Error setting item in secure storage:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey(key));
    } catch (error) {
      console.error('Error removing item from secure storage:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      keys.forEach(key => localStorage.removeItem(this.storageKey(key)));
    } catch (error) {
      console.error('Error clearing secure storage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const prefix = this.storageKeyPrefix();
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        if (fullKey?.startsWith(prefix)) {
          keys.push(fullKey.slice(prefix.length));
        }
      }
      return keys;
    } catch (error) {
      console.error('Error getting all keys from secure storage:', error);
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    return Promise.all(
      keys.map(async (key) => {
        const value = await this.getItem(key);
        return [key, value] as [string, string | null];
      })
    );
  }

  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    for (const [key, value] of keyValuePairs) {
      await this.setItem(key, value);
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    for (const key of keys) {
      await this.removeItem(key);
    }
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private getKeyFromDB(db: IDBDatabase, keyName: string): Promise<CryptoKey | null> {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(keyName);

      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  }

  private putKeyInDB(db: IDBDatabase, keyName: string, key: CryptoKey): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(key, keyName);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export default WebSecureStorage;
