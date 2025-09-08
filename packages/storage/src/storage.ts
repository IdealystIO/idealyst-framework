import { IStorage, IStorageWithListener, StorageListener } from './types';

class BaseStorage implements IStorageWithListener {
  protected storage: IStorage;
  protected listeners: Set<StorageListener> = new Set();

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  async getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.storage.setItem(key, value);
    this.notifyListeners(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await this.storage.removeItem(key);
    this.notifyListeners(key, null);
  }

  async clear(): Promise<void> {
    await this.storage.clear();
    this.notifyListeners(null, null);
  }

  async getAllKeys(): Promise<string[]> {
    return this.storage.getAllKeys();
  }

  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    if (this.storage.multiGet) {
      return this.storage.multiGet(keys);
    }
    
    const results = await Promise.all(
      keys.map(async (key) => {
        const value = await this.getItem(key);
        return [key, value] as [string, string | null];
      })
    );
    return results;
  }

  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    if (this.storage.multiSet) {
      await this.storage.multiSet(keyValuePairs);
      keyValuePairs.forEach(([key, value]) => this.notifyListeners(key, value));
      return;
    }
    
    await Promise.all(
      keyValuePairs.map(([key, value]) => this.setItem(key, value))
    );
  }

  async multiRemove(keys: string[]): Promise<void> {
    if (this.storage.multiRemove) {
      await this.storage.multiRemove(keys);
      keys.forEach((key) => this.notifyListeners(key, null));
      return;
    }
    
    await Promise.all(keys.map((key) => this.removeItem(key)));
  }

  addListener(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  protected notifyListeners(key: string | null, value: string | null): void {
    this.listeners.forEach((listener) => listener(key, value));
  }
}

export default BaseStorage;