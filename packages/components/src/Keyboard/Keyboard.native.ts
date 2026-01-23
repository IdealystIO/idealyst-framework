/**
 * Native implementation - re-exports the React Native Keyboard module.
 */
export { Keyboard } from 'react-native';

// Re-export types for convenience
export type {
  KeyboardMetrics,
  KeyboardEventEasing,
  BaseKeyboardEvent,
  AndroidKeyboardEvent,
  IOSKeyboardEvent,
  KeyboardEvent,
  KeyboardEventName,
  KeyboardEventListener,
  KeyboardSubscription,
  KeyboardStatic,
} from './types';
