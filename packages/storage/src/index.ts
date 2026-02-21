import BaseStorage from './storage';

// Platform-specific entry points (index.native.ts, index.web.ts) replace this with real instances
// This provides type compatibility for `import { storage } from '@idealyst/storage'`
const storage = null as unknown as BaseStorage;

export { BaseStorage, storage, storage as Storage };
export { createSecureStorage } from './createSecureStorage';
export default BaseStorage;
export * from './types';