import BaseStorage from './storage';

// For non-platform-specific imports, export the class (not an instance)
// Platform-specific entry points (index.native.ts, index.web.ts) export instances
export { BaseStorage };
export default BaseStorage;
export * from './types';