/**
 * Keyboard metrics describing the keyboard position and size.
 */
export interface KeyboardMetrics {
  screenX: number;
  screenY: number;
  width: number;
  height: number;
}

/**
 * Easing values for keyboard animations.
 */
export type KeyboardEventEasing =
  | 'easeIn'
  | 'easeInEaseOut'
  | 'easeOut'
  | 'linear'
  | 'keyboard';

/**
 * Base keyboard event properties available on all platforms.
 */
export interface BaseKeyboardEvent {
  duration: number;
  easing: KeyboardEventEasing;
  endCoordinates: KeyboardMetrics;
}

/**
 * Android-specific keyboard event (duration is always 0).
 */
export interface AndroidKeyboardEvent extends BaseKeyboardEvent {
  duration: 0;
  easing: 'keyboard';
}

/**
 * iOS-specific keyboard event with additional properties.
 */
export interface IOSKeyboardEvent extends BaseKeyboardEvent {
  startCoordinates: KeyboardMetrics;
  isEventFromThisApp: boolean;
}

/**
 * Keyboard event passed to listeners.
 */
export type KeyboardEvent = AndroidKeyboardEvent | IOSKeyboardEvent;

/**
 * Keyboard event names.
 * Note: 'keyboardWillShow' and 'keyboardWillHide' are iOS-only.
 * On Android with adjustResize/adjustNothing, only 'keyboardDidShow' and 'keyboardDidHide' fire.
 */
export type KeyboardEventName =
  | 'keyboardWillShow'
  | 'keyboardDidShow'
  | 'keyboardWillHide'
  | 'keyboardDidHide'
  | 'keyboardWillChangeFrame'
  | 'keyboardDidChangeFrame';

/**
 * Listener function for keyboard events.
 */
export type KeyboardEventListener = (event: KeyboardEvent) => void;

/**
 * Subscription returned by addListener, used to unsubscribe.
 */
export interface KeyboardSubscription {
  remove(): void;
}

/**
 * Static Keyboard API interface.
 */
export interface KeyboardStatic {
  /**
   * Dismisses the active keyboard and removes focus.
   */
  dismiss(): void;

  /**
   * Connects a JavaScript function to an identified native keyboard notification event.
   * Returns a subscription that can be used to unsubscribe.
   *
   * @param eventType - The keyboard event to listen for
   * @param listener - Callback function when the event fires
   * @returns Subscription with remove() method
   */
  addListener(
    eventType: KeyboardEventName,
    listener: KeyboardEventListener
  ): KeyboardSubscription;

  /**
   * Useful for syncing TextInput (or other keyboard accessory view) size
   * or position changes with keyboard movements.
   *
   * @param event - The keyboard event to schedule animation for
   */
  scheduleLayoutAnimation(event: KeyboardEvent): void;

  /**
   * Returns whether the keyboard is last known to be visible.
   */
  isVisible(): boolean;

  /**
   * Returns the metrics of the soft-keyboard if visible.
   *
   * @returns KeyboardMetrics if keyboard is visible, undefined otherwise
   */
  metrics(): KeyboardMetrics | undefined;
}
