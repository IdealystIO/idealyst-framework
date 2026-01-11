import { useCallback, useRef, useEffect } from 'react';

/**
 * Announcement priority level.
 * - 'polite': Waits for current speech to finish before announcing
 * - 'assertive': Interrupts current speech to announce immediately
 */
export type AnnounceMode = 'polite' | 'assertive';

/**
 * Options for the useAnnounce hook.
 */
export interface UseAnnounceOptions {
  /** Default announcement mode (default: 'polite') */
  defaultMode?: AnnounceMode;
  /** Time in ms before clearing the announcement (default: 1000) */
  clearDelay?: number;
}

/**
 * Return type for the useAnnounce hook.
 */
export interface UseAnnounceReturn {
  /** Announce a message with the specified mode */
  announce: (message: string, mode?: AnnounceMode) => void;
  /** Announce a message politely (waits for current speech) */
  announcePolite: (message: string) => void;
  /** Announce a message assertively (interrupts current speech) */
  announceAssertive: (message: string) => void;
  /** Clear any pending announcements */
  clear: () => void;
}

/**
 * Visually hidden styles for the live region.
 * Element is hidden from view but readable by screen readers.
 */
const VISUALLY_HIDDEN_STYLES = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

/**
 * Hook for announcing dynamic content to screen readers using ARIA live regions.
 *
 * Creates hidden live regions in the DOM that screen readers will announce
 * when content changes. Useful for:
 * - Form validation feedback
 * - Loading state changes
 * - Action confirmations
 * - Dynamic content updates
 *
 * @example
 * ```tsx
 * const { announce, announceAssertive } = useAnnounce();
 *
 * const handleSubmit = async () => {
 *   announce('Submitting form...');
 *   try {
 *     await submitForm();
 *     announce('Form submitted successfully');
 *   } catch (error) {
 *     announceAssertive('Error submitting form. Please try again.');
 *   }
 * };
 * ```
 */
export function useAnnounce(options: UseAnnounceOptions = {}): UseAnnounceReturn {
  const { defaultMode = 'polite', clearDelay = 1000 } = options;

  const politeRegionRef = useRef<HTMLDivElement | null>(null);
  const assertiveRegionRef = useRef<HTMLDivElement | null>(null);
  const clearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Create a live region element.
   */
  const createLiveRegion = useCallback((mode: AnnounceMode): HTMLDivElement => {
    const region = document.createElement('div');
    region.setAttribute('aria-live', mode);
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', mode === 'assertive' ? 'alert' : 'status');
    region.style.cssText = VISUALLY_HIDDEN_STYLES;
    region.id = `a11y-live-region-${mode}`;
    return region;
  }, []);

  // Create live regions on mount, clean up on unmount
  useEffect(() => {
    // Check if regions already exist (e.g., from another instance)
    let politeRegion = document.getElementById('a11y-live-region-polite') as HTMLDivElement | null;
    let assertiveRegion = document.getElementById('a11y-live-region-assertive') as HTMLDivElement | null;

    if (!politeRegion) {
      politeRegion = createLiveRegion('polite');
      document.body.appendChild(politeRegion);
    }
    politeRegionRef.current = politeRegion;

    if (!assertiveRegion) {
      assertiveRegion = createLiveRegion('assertive');
      document.body.appendChild(assertiveRegion);
    }
    assertiveRegionRef.current = assertiveRegion;

    // Don't remove on unmount as other components may still use them
    // The regions are shared across the application
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
    };
  }, [createLiveRegion]);

  /**
   * Clear the live regions.
   */
  const clear = useCallback(() => {
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
    }
    if (politeRegionRef.current) {
      politeRegionRef.current.textContent = '';
    }
    if (assertiveRegionRef.current) {
      assertiveRegionRef.current.textContent = '';
    }
  }, []);

  /**
   * Announce a message to screen readers.
   */
  const announce = useCallback(
    (message: string, mode: AnnounceMode = defaultMode) => {
      const region = mode === 'assertive' ? assertiveRegionRef.current : politeRegionRef.current;
      if (!region) return;

      // Clear any pending timeout
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }

      // Clear first, then set - ensures re-announcement of same message
      region.textContent = '';

      // Use requestAnimationFrame to ensure the clear is processed first
      requestAnimationFrame(() => {
        region.textContent = message;
      });

      // Clear after delay to avoid accumulation
      clearTimeoutRef.current = setTimeout(() => {
        region.textContent = '';
      }, clearDelay);
    },
    [defaultMode, clearDelay]
  );

  /**
   * Announce a message politely (waits for current speech to finish).
   */
  const announcePolite = useCallback(
    (message: string) => announce(message, 'polite'),
    [announce]
  );

  /**
   * Announce a message assertively (interrupts current speech).
   */
  const announceAssertive = useCallback(
    (message: string) => announce(message, 'assertive'),
    [announce]
  );

  return {
    announce,
    announcePolite,
    announceAssertive,
    clear,
  };
}

/**
 * React Native version of useAnnounce.
 * Uses AccessibilityInfo.announceForAccessibility on native platforms.
 */
export function useAnnounceNative(): UseAnnounceReturn {
  const announce = useCallback((message: string, _mode?: AnnounceMode) => {
    // This will be imported dynamically in native files
    // import { AccessibilityInfo } from 'react-native';
    // AccessibilityInfo.announceForAccessibility(message);

    // For now, this is a placeholder that native components will override
    console.log(`[Accessibility] ${message}`);
  }, []);

  return {
    announce,
    announcePolite: announce,
    announceAssertive: announce,
    clear: () => {},
  };
}
