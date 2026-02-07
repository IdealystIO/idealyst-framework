import { useUnistyles } from 'react-native-unistyles';
import type { Theme } from './theme';

/**
 * Hook to access the current theme.
 *
 * Returns the current theme object with full TypeScript inference
 * based on your registered theme type.
 *
 * @returns The current theme object
 *
 * @example
 * ```typescript
 * import { useTheme } from '@idealyst/theme';
 *
 * function MyComponent() {
 *   const theme = useTheme();
 *
 *   return (
 *     <View style={{ backgroundColor: theme.colors.surface.primary }}>
 *       <Text style={{ color: theme.colors.text.primary }}>
 *         Hello
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Access intent colors
 * const theme = useTheme();
 * const primaryColor = theme.intents.primary.primary;
 * const successLight = theme.intents.success.light;
 *
 * // Access sizes
 * const buttonPadding = theme.sizes.button.md.paddingHorizontal;
 *
 * // Access radii
 * const borderRadius = theme.radii.md;
 * ```
 */
export function useTheme(): Theme {
    const { theme } = useUnistyles();
    return theme as Theme;
}
