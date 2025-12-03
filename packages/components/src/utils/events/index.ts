/**
 * Cross-platform event utilities
 *
 * This module provides standardized event types and creation functions
 * that work consistently across web and native platforms.
 */

// Re-export all types
export type {
  SyntheticEvent,
  PressEvent,
  FocusEvent,
  ChangeEvent,
  TextChangeEvent,
  SelectChangeEvent,
  ToggleEvent,
  KeyboardEvent,
  ScrollEvent,
  SubmitEvent,
  PressEventHandler,
  FocusEventHandler,
  ChangeEventHandler,
  TextChangeEventHandler,
  SelectChangeEventHandler,
  ToggleEventHandler,
  KeyboardEventHandler,
  ScrollEventHandler,
  SubmitEventHandler,
} from './types';

// Re-export base utility
export { createBaseSyntheticEvent } from './types';

// Re-export platform-specific functions (native by default)
export {
  createPressEvent,
  createFocusEvent,
  createSimpleFocusEvent,
  createChangeEvent,
  createTextChangeEvent,
  createSimpleTextChangeEvent,
  createToggleEvent,
  createKeyboardEvent,
  createScrollEvent,
  createSubmitEvent,
} from './events.native';
