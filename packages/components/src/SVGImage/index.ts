// Platform-agnostic SVGImage export
// Metro will resolve to index.native.ts for React Native
// This file serves as fallback for web environments
export { default } from './SVGImage.web';
export * from './types';