/**
 * Native-specific event wrappers
 *
 * Converts React Native events to standardized cross-platform events.
 * Note: preventDefault() and stopPropagation() are no-ops on native since
 * React Native's event system doesn't have these concepts in the same way.
 */

import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextInputFocusEventData,
  TextInputChangeEventData,
} from 'react-native';

import type {
  PressEvent,
  FocusEvent,
  ChangeEvent,
  TextChangeEvent,
  ToggleEvent,
  KeyboardEvent,
  ScrollEvent,
  SubmitEvent,
} from './types';

// No-op functions for native (these concepts don't apply)
const noop = () => {};

/**
 * Wraps a React Native GestureResponderEvent into a standardized PressEvent
 */
export function createPressEvent(
  event: GestureResponderEvent,
  type: PressEvent['type'] = 'press'
): PressEvent {
  return {
    nativeEvent: event.nativeEvent,
    timestamp: event.nativeEvent.timestamp,
    defaultPrevented: false,
    propagationStopped: false,
    type,
    preventDefault: noop,
    stopPropagation: noop,
  };
}

/**
 * Wraps a React Native focus event into a standardized FocusEvent
 */
export function createFocusEvent(
  event: NativeSyntheticEvent<TextInputFocusEventData>,
  type: FocusEvent['type']
): FocusEvent {
  return {
    nativeEvent: event.nativeEvent,
    timestamp: Date.now(),
    defaultPrevented: false,
    propagationStopped: false,
    type,
    preventDefault: noop,
    stopPropagation: noop,
  };
}

/**
 * Creates a standardized FocusEvent without a native event (for simple focus tracking)
 */
export function createSimpleFocusEvent(type: FocusEvent['type']): FocusEvent {
  return {
    nativeEvent: null,
    timestamp: Date.now(),
    defaultPrevented: false,
    propagationStopped: false,
    type,
    preventDefault: noop,
    stopPropagation: noop,
  };
}

/**
 * Wraps a value change into a standardized ChangeEvent
 */
export function createChangeEvent<V = string>(value: V): ChangeEvent<V> {
  return {
    nativeEvent: null,
    timestamp: Date.now(),
    defaultPrevented: false,
    propagationStopped: false,
    type: 'change',
    value,
    preventDefault: noop,
    stopPropagation: noop,
  };
}

/**
 * Wraps a React Native text change event into a standardized TextChangeEvent
 */
export function createTextChangeEvent(
  event: NativeSyntheticEvent<TextInputChangeEventData>
): TextChangeEvent {
  const text = event.nativeEvent.text;
  return {
    nativeEvent: event.nativeEvent,
    timestamp: Date.now(),
    defaultPrevented: false,
    propagationStopped: false,
    type: 'change',
    value: text,
    text,
    preventDefault: noop,
    stopPropagation: noop,
  };
}

/**
 * Creates a TextChangeEvent from a simple text value (for onChangeText)
 */
export function createSimpleTextChangeEvent(text: string): TextChangeEvent {
  return {
    nativeEvent: null,
    timestamp: Date.now(),
    defaultPrevented: false,
    propagationStopped: false,
    type: 'change',
    value: text,
    text,
    preventDefault: noop,
    stopPropagation: noop,
  };
}

/**
 * Creates a standardized ToggleEvent for switch/checkbox changes
 */
export function createToggleEvent(checked: boolean): ToggleEvent {
  return {
    nativeEvent: null,
    timestamp: Date.now(),
    defaultPrevented: false,
    propagationStopped: false,
    type: 'change',
    value: checked,
    checked,
    preventDefault: noop,
    stopPropagation: noop,
  };
}

/**
 * Creates a standardized KeyboardEvent
 * Note: React Native's keyboard events are more limited than web
 */
export function createKeyboardEvent(
  key: string,
  type: KeyboardEvent['type']
): KeyboardEvent {
  return {
    nativeEvent: null,
    timestamp: Date.now(),
    defaultPrevented: false,
    propagationStopped: false,
    type,
    key,
    keyCode: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    preventDefault: noop,
    stopPropagation: noop,
  };
}

/**
 * Wraps a React Native scroll event into a standardized ScrollEvent
 */
export function createScrollEvent(
  event: NativeSyntheticEvent<NativeScrollEvent>,
  type: ScrollEvent['type'] = 'scroll'
): ScrollEvent {
  const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
  return {
    nativeEvent: event.nativeEvent,
    timestamp: Date.now(),
    defaultPrevented: false,
    propagationStopped: false,
    type,
    contentOffset,
    contentSize,
    layoutMeasurement,
    preventDefault: noop,
    stopPropagation: noop,
  };
}

/**
 * Creates a standardized SubmitEvent
 */
export function createSubmitEvent(): SubmitEvent {
  return {
    nativeEvent: null,
    timestamp: Date.now(),
    defaultPrevented: false,
    propagationStopped: false,
    type: 'submit',
    preventDefault: noop,
    stopPropagation: noop,
  };
}
