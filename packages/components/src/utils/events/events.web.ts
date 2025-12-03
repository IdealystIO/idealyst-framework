/**
 * Web-specific event wrappers
 *
 * Converts React web events to standardized cross-platform events
 */

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

type ReactMouseEvent = React.MouseEvent<HTMLElement>;
type ReactFocusEvent = React.FocusEvent<HTMLElement>;
type ReactChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
type ReactKeyboardEvent = React.KeyboardEvent<HTMLElement>;
type ReactFormEvent = React.FormEvent<HTMLFormElement>;
type ReactUIEvent = React.UIEvent<HTMLElement>;

/**
 * Wraps a React mouse/click event into a standardized PressEvent
 */
export function createPressEvent(
  event: ReactMouseEvent,
  type: PressEvent['type'] = 'press'
): PressEvent {
  return {
    nativeEvent: event.nativeEvent,
    timestamp: event.timeStamp,
    defaultPrevented: event.defaultPrevented,
    propagationStopped: false,
    type,
    preventDefault: () => event.preventDefault(),
    stopPropagation: () => event.stopPropagation(),
  };
}

/**
 * Wraps a React focus event into a standardized FocusEvent
 */
export function createFocusEvent(
  event: ReactFocusEvent,
  type: FocusEvent['type']
): FocusEvent {
  return {
    nativeEvent: event.nativeEvent,
    timestamp: event.timeStamp,
    defaultPrevented: event.defaultPrevented,
    propagationStopped: false,
    type,
    preventDefault: () => event.preventDefault(),
    stopPropagation: () => event.stopPropagation(),
  };
}

/**
 * Wraps a React change event into a standardized ChangeEvent
 */
export function createChangeEvent<V = string>(
  event: ReactChangeEvent,
  value: V
): ChangeEvent<V> {
  return {
    nativeEvent: event.nativeEvent,
    timestamp: event.timeStamp,
    defaultPrevented: event.defaultPrevented,
    propagationStopped: false,
    type: 'change',
    value,
    preventDefault: () => event.preventDefault(),
    stopPropagation: () => event.stopPropagation(),
  };
}

/**
 * Wraps a React change event for text inputs into a standardized TextChangeEvent
 */
export function createTextChangeEvent(event: ReactChangeEvent): TextChangeEvent {
  const value = event.target.value;
  return {
    nativeEvent: event.nativeEvent,
    timestamp: event.timeStamp,
    defaultPrevented: event.defaultPrevented,
    propagationStopped: false,
    type: 'change',
    value,
    text: value,
    preventDefault: () => event.preventDefault(),
    stopPropagation: () => event.stopPropagation(),
  };
}

/**
 * Wraps a React change event for checkboxes/switches into a standardized ToggleEvent
 */
export function createToggleEvent(event: ReactChangeEvent): ToggleEvent {
  const checked = (event.target as HTMLInputElement).checked;
  return {
    nativeEvent: event.nativeEvent,
    timestamp: event.timeStamp,
    defaultPrevented: event.defaultPrevented,
    propagationStopped: false,
    type: 'change',
    value: checked,
    checked,
    preventDefault: () => event.preventDefault(),
    stopPropagation: () => event.stopPropagation(),
  };
}

/**
 * Wraps a React keyboard event into a standardized KeyboardEvent
 */
export function createKeyboardEvent(
  event: ReactKeyboardEvent,
  type: KeyboardEvent['type']
): KeyboardEvent {
  return {
    nativeEvent: event.nativeEvent,
    timestamp: event.timeStamp,
    defaultPrevented: event.defaultPrevented,
    propagationStopped: false,
    type,
    key: event.key,
    keyCode: event.keyCode,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    preventDefault: () => event.preventDefault(),
    stopPropagation: () => event.stopPropagation(),
  };
}

/**
 * Wraps a React scroll event into a standardized ScrollEvent
 */
export function createScrollEvent(
  event: ReactUIEvent,
  type: ScrollEvent['type'] = 'scroll'
): ScrollEvent {
  const target = event.target as HTMLElement;
  return {
    nativeEvent: event.nativeEvent,
    timestamp: event.timeStamp,
    defaultPrevented: event.defaultPrevented,
    propagationStopped: false,
    type,
    contentOffset: {
      x: target.scrollLeft,
      y: target.scrollTop,
    },
    contentSize: {
      width: target.scrollWidth,
      height: target.scrollHeight,
    },
    layoutMeasurement: {
      width: target.clientWidth,
      height: target.clientHeight,
    },
    preventDefault: () => event.preventDefault(),
    stopPropagation: () => event.stopPropagation(),
  };
}

/**
 * Wraps a React form submit event into a standardized SubmitEvent
 */
export function createSubmitEvent(event: ReactFormEvent): SubmitEvent {
  return {
    nativeEvent: event.nativeEvent,
    timestamp: event.timeStamp,
    defaultPrevented: event.defaultPrevented,
    propagationStopped: false,
    type: 'submit',
    preventDefault: () => event.preventDefault(),
    stopPropagation: () => event.stopPropagation(),
  };
}
