/**
 * useSafeAreaInsets - Web implementation
 *
 * Returns zero insets on web since safe areas are a native concept.
 * This allows cross-platform code to use safe area insets without
 * platform checks.
 */

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const ZERO_INSETS: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };

export function useSafeAreaInsets(): SafeAreaInsets {
  return ZERO_INSETS;
}
