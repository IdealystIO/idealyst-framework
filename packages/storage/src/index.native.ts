import BaseStorage from './storage';
import NativeStorage from './storage.native';

const storage = new BaseStorage(new NativeStorage());

export default storage;
export { storage, BaseStorage, NativeStorage };
export * from './types';