export interface SecureStorageOptions {
  /**
   * Namespace prefix for storage keys.
   * - Native: used as the Keychain service name and MMKV instance ID.
   * - Web: used as prefix for localStorage keys and IndexedDB key name.
   * @default 'secure'
   */
  prefix?: string;
}

export interface IStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<string[]>;
  multiGet?: (keys: string[]) => Promise<Array<[string, string | null]>>;
  multiSet?: (keyValuePairs: Array<[string, string]>) => Promise<void>;
  multiRemove?: (keys: string[]) => Promise<void>;
}

export type StorageListener = (key: string | null, value: string | null) => void;

export interface IStorageWithListener extends IStorage {
  addListener: (listener: StorageListener) => () => void;
}