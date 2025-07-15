// Platform-agnostic Card export
// Metro will resolve to index.native.ts for React Native
// This file serves as fallback for web environments
export { default } from './Card.web';
export * from './types'; 