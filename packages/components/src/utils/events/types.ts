/**
 * Standardized cross-platform event system
 *
 * Provides unified event interfaces that work consistently across web and native.
 * On native, methods like preventDefault() and stopPropagation() are no-ops since
 * React Native's event system doesn't have these concepts in the same way.
 */

/**
 * Base synthetic event interface that normalizes web and native events
 */
export interface SyntheticEvent<T = unknown> {
  /**
   * The native event (platform-specific)
   * - Web: React.SyntheticEvent
   * - Native: GestureResponderEvent or NativeSyntheticEvent
   */
  nativeEvent: T;

  /**
   * Prevents the default behavior of the event.
   * On native, this is a no-op as there's no default behavior concept.
   */
  preventDefault: () => void;

  /**
   * Stops the event from propagating to parent elements.
   * On native, this is a no-op.
   */
  stopPropagation: () => void;

  /**
   * Whether preventDefault() has been called
   */
  defaultPrevented: boolean;

  /**
   * Whether stopPropagation() has been called
   */
  propagationStopped: boolean;

  /**
   * Timestamp of when the event occurred
   */
  timestamp: number;
}

/**
 * Press/Click event - for buttons, pressables, touchable elements
 */
export interface PressEvent extends SyntheticEvent {
  /**
   * The type of press event
   */
  type: 'press' | 'pressIn' | 'pressOut' | 'longPress';
}

/**
 * Focus event - for inputs and focusable elements
 */
export interface FocusEvent extends SyntheticEvent {
  /**
   * The type of focus event
   */
  type: 'focus' | 'blur';
}

/**
 * Change event - for inputs, selects, checkboxes, etc.
 */
export interface ChangeEvent<V = string> extends SyntheticEvent {
  /**
   * The new value after the change
   */
  value: V;

  /**
   * The type of change event
   */
  type: 'change';
}

/**
 * Text change event - specifically for text inputs
 */
export interface TextChangeEvent extends ChangeEvent<string> {
  /**
   * The text value
   */
  text: string;
}

/**
 * Selection change event - for selects, dropdowns
 */
export interface SelectChangeEvent<V = string> extends ChangeEvent<V> {
  /**
   * The selected value(s)
   */
  selected: V;
}

/**
 * Toggle event - for switches, checkboxes
 */
export interface ToggleEvent extends ChangeEvent<boolean> {
  /**
   * Whether the toggle is now checked/on
   */
  checked: boolean;
}

/**
 * Keyboard event - for keyboard interactions
 */
export interface KeyboardEvent extends SyntheticEvent {
  /**
   * The key that was pressed
   */
  key: string;

  /**
   * The key code
   */
  keyCode: number;

  /**
   * Whether the alt/option key was pressed
   */
  altKey: boolean;

  /**
   * Whether the control key was pressed
   */
  ctrlKey: boolean;

  /**
   * Whether the meta/command key was pressed
   */
  metaKey: boolean;

  /**
   * Whether the shift key was pressed
   */
  shiftKey: boolean;

  /**
   * The type of keyboard event
   */
  type: 'keyDown' | 'keyUp' | 'keyPress';
}

/**
 * Scroll event - for scrollable containers
 */
export interface ScrollEvent extends SyntheticEvent {
  /**
   * Current scroll position
   */
  contentOffset: {
    x: number;
    y: number;
  };

  /**
   * Size of the scrollable content
   */
  contentSize: {
    width: number;
    height: number;
  };

  /**
   * Size of the visible container
   */
  layoutMeasurement: {
    width: number;
    height: number;
  };

  /**
   * The type of scroll event
   */
  type: 'scroll' | 'scrollBegin' | 'scrollEnd';
}

/**
 * Submit event - for forms
 */
export interface SubmitEvent extends SyntheticEvent {
  /**
   * The type of submit event
   */
  type: 'submit';
}

// Event handler type aliases for convenience
export type PressEventHandler = (event: PressEvent) => void;
export type FocusEventHandler = (event: FocusEvent) => void;
export type ChangeEventHandler<V = string> = (event: ChangeEvent<V>) => void;
export type TextChangeEventHandler = (event: TextChangeEvent) => void;
export type SelectChangeEventHandler<V = string> = (event: SelectChangeEvent<V>) => void;
export type ToggleEventHandler = (event: ToggleEvent) => void;
export type KeyboardEventHandler = (event: KeyboardEvent) => void;
export type ScrollEventHandler = (event: ScrollEvent) => void;
export type SubmitEventHandler = (event: SubmitEvent) => void;

/**
 * Creates a base synthetic event object with default implementations
 */
export function createBaseSyntheticEvent<T>(nativeEvent: T): SyntheticEvent<T> {
  let defaultPrevented = false;
  let propagationStopped = false;

  return {
    nativeEvent,
    timestamp: Date.now(),
    get defaultPrevented() {
      return defaultPrevented;
    },
    get propagationStopped() {
      return propagationStopped;
    },
    preventDefault() {
      defaultPrevented = true;
    },
    stopPropagation() {
      propagationStopped = true;
    },
  };
}
