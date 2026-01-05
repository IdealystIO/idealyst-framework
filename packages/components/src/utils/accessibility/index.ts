/**
 * @idealyst/components - Accessibility Utilities
 *
 * This module provides comprehensive accessibility support for building
 * WCAG 2.1 AA compliant React and React Native applications.
 *
 * @example
 * ```tsx
 * import {
 *   AccessibilityProps,
 *   getWebAriaProps,
 *   useKeyboardNavigation,
 *   useFocusTrap,
 *   MENU_KEYS,
 * } from '@idealyst/components/utils/accessibility';
 * ```
 */

// =============================================================================
// TYPES
// =============================================================================

export type {
  // Role types
  AriaRole,
  NativeAccessibilityRole,
  // Accessibility prop interfaces
  AccessibilityProps,
  InteractiveAccessibilityProps,
  FormAccessibilityProps,
  RangeAccessibilityProps,
  SelectionAccessibilityProps,
  LiveRegionAccessibilityProps,
  SortableAccessibilityProps,
  SelectableAccessibilityProps,
  HeadingAccessibilityProps,
  CurrentAccessibilityProps,
  // Native types
  NativeAccessibilityState,
  NativeAccessibilityValue,
} from './types';

// =============================================================================
// ARIA HELPERS
// =============================================================================

export {
  // Web ARIA mappers
  getWebAriaProps,
  getWebInteractiveAriaProps,
  getWebFormAriaProps,
  getWebRangeAriaProps,
  getWebSelectionAriaProps,
  getWebLiveRegionAriaProps,
  getWebSortableAriaProps,
  getWebSelectableAriaProps,
  getWebHeadingAriaProps,
  getWebCurrentAriaProps,
  // React Native mappers
  mapRoleToNative,
  getNativeAccessibilityProps,
  getNativeInteractiveAccessibilityProps,
  getNativeFormAccessibilityProps,
  getNativeRangeAccessibilityProps,
  getNativeSelectionAccessibilityProps,
  getNativeLiveRegionAccessibilityProps,
  getNativeSelectableAccessibilityProps,
} from './ariaHelpers';

// =============================================================================
// HOOKS
// =============================================================================

export { useKeyboardNavigation } from './useKeyboardNavigation';
export type {
  UseKeyboardNavigationOptions,
  UseKeyboardNavigationReturn,
} from './useKeyboardNavigation';

export { useFocusTrap, useFocusTrapNative } from './useFocusTrap';
export type { UseFocusTrapOptions, UseFocusTrapReturn } from './useFocusTrap';

export { useAnnounce, useAnnounceNative } from './useAnnounce';
export type { AnnounceMode, UseAnnounceOptions, UseAnnounceReturn } from './useAnnounce';

// =============================================================================
// KEYBOARD PATTERNS
// =============================================================================

export {
  // Key pattern constants
  BUTTON_KEYS,
  LINK_KEYS,
  MENU_KEYS,
  ACCORDION_KEYS,
  TAB_KEYS,
  SLIDER_KEYS,
  LISTBOX_KEYS,
  DIALOG_KEYS,
  CHECKBOX_KEYS,
  RADIO_KEYS,
  SWITCH_KEYS,
  TREE_KEYS,
  GRID_KEYS,
  COMBOBOX_KEYS,
  TOOLTIP_KEYS,
  // Helper functions
  matchesKey,
  matchesKeyPattern,
} from './keyboardPatterns';

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Counter for generating unique accessibility IDs.
 */
let idCounter = 0;

/**
 * Generate a unique ID for accessibility attributes.
 * Use this for aria-labelledby, aria-describedby, aria-controls, etc.
 *
 * @param prefix - Optional prefix for the ID (default: 'a11y')
 * @returns A unique string ID
 *
 * @example
 * ```tsx
 * const inputId = generateAccessibilityId('input');     // 'input-1'
 * const errorId = generateAccessibilityId('error');     // 'error-2'
 * const helperId = generateAccessibilityId('helper');   // 'helper-3'
 *
 * <Input
 *   id={inputId}
 *   aria-describedby={`${helperId} ${errorId}`}
 * />
 * <Text id={helperId}>Enter your email</Text>
 * <Text id={errorId}>Invalid email format</Text>
 * ```
 */
export function generateAccessibilityId(prefix: string = 'a11y'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Reset the ID counter. Useful for testing.
 * @internal
 */
export function resetAccessibilityIdCounter(): void {
  idCounter = 0;
}

/**
 * Combine multiple accessibility IDs into a space-separated string.
 * Filters out undefined/null values.
 *
 * @param ids - Array of IDs (can include undefined/null)
 * @returns Space-separated string of IDs, or undefined if all are empty
 *
 * @example
 * ```tsx
 * const describedBy = combineIds([helperId, hasError ? errorId : undefined]);
 * // Returns: "helper-1 error-2" or "helper-1" depending on hasError
 * ```
 */
export function combineIds(ids: (string | undefined | null)[]): string | undefined {
  const filtered = ids.filter((id): id is string => Boolean(id));
  return filtered.length > 0 ? filtered.join(' ') : undefined;
}

/**
 * Check if the user prefers reduced motion.
 * Useful for disabling animations/transitions for accessibility.
 *
 * @returns true if the user prefers reduced motion
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = checkReducedMotion();
 * const transitionDuration = prefersReducedMotion ? 0 : 300;
 * ```
 */
export function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  return mediaQuery?.matches ?? false;
}

/**
 * Minimum touch target size in pixels (WCAG 2.5.5 Target Size).
 * Interactive elements should be at least 44x44 pixels.
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Minimum contrast ratio for normal text (WCAG 2.1 AA).
 */
export const MIN_CONTRAST_RATIO_NORMAL = 4.5;

/**
 * Minimum contrast ratio for large text (WCAG 2.1 AA).
 * Large text is 18pt+ or 14pt+ bold.
 */
export const MIN_CONTRAST_RATIO_LARGE = 3;

/**
 * Minimum contrast ratio for UI components (WCAG 2.1 AA).
 */
export const MIN_CONTRAST_RATIO_UI = 3;
