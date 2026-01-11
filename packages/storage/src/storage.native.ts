import { createMMKV } from 'react-native-mmkv';
import { IStorage } from './types';

class NativeStorage implements IStorage {
  private storage = createMMKV();

  async getItem(key: string): Promise<string | null> {
    try {
      return this.storage.getString(key) || null;
    } catch (error) {
      console.error('Error getting item from MMKV:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.storage.set(key, value);
    } catch (error) {
      console.error('Error setting item in MMKV:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      this.storage.remove(key);
    } catch (error) {
      console.error('Error removing item from MMKV:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.clearAll();
    } catch (error) {
      console.error('Error clearing MMKV:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return this.storage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys from MMKV:', error);
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      return keys.map(key => [key, this.storage.getString(key) || null]);
    } catch (error) {
      console.error('Error in multiGet from MMKV:', error);
      return keys.map(key => [key, null]);
    }
  }

  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      keyValuePairs.forEach(([key, value]) => {
        this.storage.set(key, value);
      });
    } catch (error) {
      console.error('Error in multiSet to MMKV:', error);
      throw error;
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      keys.forEach(key => {
        this.storage.remove(key);
      });
    } catch (error) {
      console.error('Error in multiRemove from MMKV:', error);
      throw error;
    }
  }
}

export default NativeStorage;