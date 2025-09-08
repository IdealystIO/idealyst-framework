import BaseStorage from './storage';
import NativeStorage from './storage.native';

const Storage = new BaseStorage(new NativeStorage());

export default Storage;
export { BaseStorage, NativeStorage };
export * from './types';