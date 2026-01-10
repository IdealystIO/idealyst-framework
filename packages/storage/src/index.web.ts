import BaseStorage from './storage';
import WebStorage from './storage.web';

const storage = new BaseStorage(new WebStorage());

export default storage;
export { storage, BaseStorage, WebStorage };
export * from './types';