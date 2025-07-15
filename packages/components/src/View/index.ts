// Platform-agnostic View export
// Bundlers will resolve to index.web.ts (web) or index.native.ts (React Native)
// This file serves as fallback for web environments
export { default } from './View.web';
export * from './types'; 