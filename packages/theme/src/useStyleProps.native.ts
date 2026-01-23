/**
 * useStyleProps - Native implementation
 *
 * Unified hook for applying styles across platforms.
 * On native, combines Unistyles and additional styles into an array.
 *
 * @example
 * ```tsx
 * import { View } from '@idealyst/components';
 * import { useStyleProps } from '@idealyst/theme';
 *
 * function MyComponent({ style }: { style?: StyleProp<ViewStyle> }) {
 *   const styleProps = useStyleProps(
 *     (myStyles.container as any)({}),  // Unistyles
 *     [style, { marginTop: 16 }]        // Additional styles (array or single)
 *   );
 *
 *   // Native: spreads { style: [unistyles, ...inlineStyles] }
 *   return <View {...styleProps}>Content</View>;
 * }
 * ```
 */

import { useMemo } from 'react';
import type { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type AnyStyle = ViewStyle | TextStyle | ImageStyle;
type StyleInput = AnyStyle | StyleProp<AnyStyle> | undefined | null | false;

export interface StyleProps {
  /** Style array to pass to React Native components */
  style?: StyleInput[];
}

/**
 * Hook that returns style props for native components.
 *
 * @param unistyles - Unistyles style (from stylesheet)
 * @param inlineStyles - Additional inline styles (single style or array)
 * @returns Object with style array to spread onto element
 */
export function useStyleProps(
  unistyles: StyleInput,
  inlineStyles?: StyleInput | StyleInput[]
): StyleProps {
  return useMemo(() => {
    // Combine unistyles with inline styles into array
    const styles: StyleInput[] = [unistyles];

    if (inlineStyles) {
      if (Array.isArray(inlineStyles)) {
        for (const s of inlineStyles) {
          styles.push(s as StyleInput);
        }
      } else {
        styles.push(inlineStyles);
      }
    }

    return { style: styles };
  }, [unistyles, inlineStyles]);
}
