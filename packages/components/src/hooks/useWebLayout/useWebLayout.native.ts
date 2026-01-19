import { useRef } from 'react';
import type { LayoutChangeEvent } from './types';

/**
 * No-op hook for native - onLayout is handled natively by React Native components.
 * Returns a ref for API compatibility, but it's not used on native.
 *
 * @param _onLayout - Unused on native (React Native components handle onLayout directly)
 * @returns A ref (unused on native, for API compatibility)
 */
export function useWebLayout<T = any>(
  _onLayout: ((event: LayoutChangeEvent) => void) | undefined
) {
  return useRef<T>(null);
}
