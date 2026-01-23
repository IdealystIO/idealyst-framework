/**
 * useStyleProps - Web implementation
 *
 * Unified hook for applying styles across platforms.
 * On web, wraps Unistyles with getWebProps to generate CSS class names,
 * and passes additional styles for the style prop.
 *
 * @example
 * ```tsx
 * import { View } from '@idealyst/components';
 * import { useStyleProps } from '@idealyst/theme';
 *
 * function MyComponent({ style }: { style?: StyleProp<ViewStyle> }) {
 *   const styleProps = useStyleProps(
 *     (myStyles.container as any)({}),  // Unistyles (goes through getWebProps)
 *     [style, { marginTop: 16 }]        // Additional styles (array or single)
 *   );
 *
 *   // Web: spreads { className, ref, style }
 *   return <View {...styleProps}>Content</View>;
 * }
 * ```
 */

import { useMemo } from 'react';
import type { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { getWebProps } from 'react-native-unistyles/web';

type AnyStyle = ViewStyle | TextStyle | ImageStyle | React.CSSProperties;
type StyleInput = AnyStyle | StyleProp<AnyStyle> | undefined | null | false;

export interface StyleProps {
  /** CSS class name(s) for the element (from Unistyles) */
  className?: string;
  /** Ref to attach to the element (required for Unistyles on web) */
  ref?: React.Ref<any>;
  /** Additional inline styles */
  style?: StyleInput | StyleInput[];
}

/**
 * Hook that returns style props for web components.
 *
 * @param unistyles - Unistyles style (from stylesheet), passed to getWebProps
 * @param inlineStyles - Additional inline styles (single style or array)
 * @returns Object with className, ref, and style to spread onto element
 */
export function useStyleProps(
  unistyles: StyleInput,
  inlineStyles?: StyleInput | StyleInput[]
): StyleProps {
  return useMemo(() => {
    // Process Unistyles through getWebProps
    const webProps = getWebProps(unistyles as any);

    return {
      ...webProps,
      style: inlineStyles,
    };
  }, [unistyles, inlineStyles]);
}
