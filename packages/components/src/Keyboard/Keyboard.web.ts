import type {
  KeyboardStatic,
  KeyboardEventName,
  KeyboardEventListener,
  KeyboardSubscription,
  KeyboardEvent,
  KeyboardMetrics,
} from './types';

/**
 * Web implementation of the Keyboard API.
 * This is a noop implementation since web doesn't have a virtual keyboard API
 * in the same way as React Native.
 *
 * All methods are safe to call but have no effect on web.
 */
export const Keyboard: KeyboardStatic = {
  /**
   * Noop on web - there's no virtual keyboard to dismiss.
   * On web, you can blur the active element instead: document.activeElement?.blur()
   */
  dismiss(): void {
    // Noop on web
    // Optionally blur the active element to simulate keyboard dismiss
    if (typeof document !== 'undefined' && document.activeElement) {
      (document.activeElement as HTMLElement).blur?.();
    }
  },

  /**
   * Noop on web - returns a subscription that does nothing.
   * The VirtualKeyboard API exists in some browsers but has limited support.
   */
  addListener(
    _eventType: KeyboardEventName,
    _listener: KeyboardEventListener
  ): KeyboardSubscription {
    // Return a noop subscription
    return {
      remove: () => {
        // Noop
      },
    };
  },

  /**
   * Noop on web - no keyboard animations to sync with.
   */
  scheduleLayoutAnimation(_event: KeyboardEvent): void {
    // Noop on web
  },

  /**
   * Always returns false on web - no virtual keyboard visibility tracking.
   */
  isVisible(): boolean {
    return false;
  },

  /**
   * Always returns undefined on web - no keyboard metrics available.
   */
  metrics(): KeyboardMetrics | undefined {
    return undefined;
  },
};

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
