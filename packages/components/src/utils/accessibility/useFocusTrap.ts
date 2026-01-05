import { useEffect, useRef, useCallback } from 'react';

/**
 * Options for the useFocusTrap hook.
 */
export interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  active: boolean;
  /** Ref to the container element that traps focus */
  containerRef: React.RefObject<HTMLElement>;
  /** Whether to restore focus to the previously focused element when deactivated */
  restoreFocus?: boolean;
  /** Whether to auto-focus the first focusable element when activated */
  autoFocus?: boolean;
  /** CSS selector for the element to focus initially (overrides autoFocus) */
  initialFocus?: string;
  /** CSS selector for the element to focus when closing (overrides restoreFocus) */
  returnFocus?: string;
  /** Callback when Escape key is pressed */
  onEscape?: () => void;
}

/**
 * Return type for the useFocusTrap hook.
 */
export interface UseFocusTrapReturn {
  /** Manually focus the first focusable element in the container */
  focusFirst: () => void;
  /** Manually focus the last focusable element in the container */
  focusLast: () => void;
  /** Get all focusable elements within the container */
  getFocusableElements: () => HTMLElement[];
}

/**
 * Selector for focusable elements.
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

/**
 * Hook for implementing WCAG-compliant focus trapping in dialogs and modals.
 *
 * Features:
 * - Traps focus within a container element
 * - Tab cycles through focusable elements
 * - Shift+Tab cycles in reverse
 * - Auto-focuses first element on activation
 * - Restores focus on deactivation
 * - Escape key handling
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * const [isOpen, setIsOpen] = useState(false);
 *
 * const { focusFirst } = useFocusTrap({
 *   active: isOpen,
 *   containerRef,
 *   onEscape: () => setIsOpen(false),
 * });
 *
 * return (
 *   <div
 *     ref={containerRef}
 *     role="dialog"
 *     aria-modal="true"
 *   >
 *     <button>Focusable</button>
 *     <button onClick={() => setIsOpen(false)}>Close</button>
 *   </div>
 * );
 * ```
 */
export function useFocusTrap({
  active,
  containerRef,
  restoreFocus = true,
  autoFocus = true,
  initialFocus,
  returnFocus,
  onEscape,
}: UseFocusTrapOptions): UseFocusTrapReturn {
  // Store the element that was focused before the trap was activated
  const previousActiveElement = useRef<HTMLElement | null>(null);

  /**
   * Get all focusable elements within the container.
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    );

    // Filter out elements that are not visible or are disabled
    return elements.filter((el) => {
      // Check if element is visible
      if (el.offsetParent === null && el.style.position !== 'fixed') {
        return false;
      }
      // Check computed visibility
      const style = window.getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') {
        return false;
      }
      return true;
    });
  }, [containerRef]);

  /**
   * Focus the first focusable element in the container.
   */
  const focusFirst = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Try to focus the initial focus element first
    if (initialFocus) {
      const initialElement = container.querySelector<HTMLElement>(initialFocus);
      if (initialElement) {
        initialElement.focus();
        return;
      }
    }

    // Otherwise focus the first focusable element
    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      // If no focusable elements, focus the container itself
      container.setAttribute('tabindex', '-1');
      container.focus();
    }
  }, [containerRef, initialFocus, getFocusableElements]);

  /**
   * Focus the last focusable element in the container.
   */
  const focusLast = useCallback(() => {
    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus();
    }
  }, [getFocusableElements]);

  /**
   * Handle Tab key to trap focus within the container.
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!active) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        // Shift + Tab - going backwards
        if (activeElement === firstFocusable || !containerRef.current?.contains(activeElement)) {
          event.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab - going forwards
        if (activeElement === lastFocusable || !containerRef.current?.contains(activeElement)) {
          event.preventDefault();
          firstFocusable.focus();
        }
      }
    },
    [active, getFocusableElements, containerRef, onEscape]
  );

  /**
   * Handle clicks outside the container (optional - for click-away to close).
   */
  const handleFocusIn = useCallback(
    (event: FocusEvent) => {
      if (!active || !containerRef.current) return;

      // If focus moves outside the container, bring it back
      if (!containerRef.current.contains(event.target as Node)) {
        focusFirst();
      }
    },
    [active, containerRef, focusFirst]
  );

  // Set up and tear down the focus trap
  useEffect(() => {
    if (active) {
      // Store currently focused element before trapping
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('focusin', handleFocusIn);

      // Auto-focus after a short delay to ensure the container is rendered
      if (autoFocus) {
        requestAnimationFrame(() => {
          focusFirst();
        });
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);

      // Restore focus when deactivating
      if (active && restoreFocus) {
        if (returnFocus) {
          const returnElement = document.querySelector<HTMLElement>(returnFocus);
          if (returnElement) {
            returnElement.focus();
            return;
          }
        }
        if (previousActiveElement.current && previousActiveElement.current.focus) {
          previousActiveElement.current.focus();
        }
      }
    };
  }, [active, autoFocus, restoreFocus, returnFocus, handleKeyDown, handleFocusIn, focusFirst]);

  return {
    focusFirst,
    focusLast,
    getFocusableElements,
  };
}

/**
 * Native version of useFocusTrap - no-op since React Native handles
 * modal focus differently via the Modal component.
 */
export function useFocusTrapNative(): UseFocusTrapReturn {
  return {
    focusFirst: () => {},
    focusLast: () => {},
    getFocusableElements: () => [],
  };
}
