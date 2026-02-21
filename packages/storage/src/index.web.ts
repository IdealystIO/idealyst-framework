import BaseStorage from './storage';
import WebStorage from './storage.web';

const storage = new BaseStorage(new WebStorage());

export default storage;
// Export instance as both `storage` and `Storage` for convenience
export { storage, storage as Storage, BaseStorage, WebStorage };
export { createSecureStorage } from './createSecureStorage.web';
export { default as WebSecureStorage } from './secure-storage.web';
export * from './types';