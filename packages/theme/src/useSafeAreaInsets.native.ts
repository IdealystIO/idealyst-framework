/**
 * useSafeAreaInsets - Native implementation
 *
 * Re-exports useSafeAreaInsets from react-native-safe-area-context
 * with the shared SafeAreaInsets type.
 */

import { useSafeAreaInsets as useNativeSafeAreaInsets } from 'react-native-safe-area-context';
import type { SafeAreaInsets } from './useSafeAreaInsets';

export type { SafeAreaInsets };

export function useSafeAreaInsets(): SafeAreaInsets {
  return useNativeSafeAreaInsets();
}
