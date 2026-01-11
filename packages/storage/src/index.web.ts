import BaseStorage from './storage';
import WebStorage from './storage.web';

const storage = new BaseStorage(new WebStorage());

export default storage;
// Export instance as both `storage` and `Storage` for convenience
export { storage, storage as Storage, BaseStorage, WebStorage };
export * from './types';