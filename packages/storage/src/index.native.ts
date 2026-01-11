import BaseStorage from './storage';
import NativeStorage from './storage.native';

const storage = new BaseStorage(new NativeStorage());

export default storage;
// Export instance as both `storage` and `Storage` for convenience
export { storage, storage as Storage, BaseStorage, NativeStorage };
export * from './types';