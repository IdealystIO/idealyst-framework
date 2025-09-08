import BaseStorage from './storage';
import WebStorage from './storage.web';

const Storage = new BaseStorage(new WebStorage());

export default Storage;
export { BaseStorage, WebStorage };
export * from './types';