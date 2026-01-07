/**
 * Text styles using $iterator expansion for theme reactivity.
 */
import { StyleSheet } from "react-native-unistyles";
import { ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';
import { TextAlignVariant, TextColorVariant, TextWeightVariant, TextTypographyVariant } from "./types";

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type TextVariants = {
    typography: TextTypographyVariant;
    weight: TextWeightVariant;
    align: TextAlignVariant;
}

type TextStyleParams = {
    color?: TextColorVariant;
}

/**
 * Text styles with $iterator expansion.
 *
 * Babel expands:
 * - theme.sizes.$typography.X → all typography keys (h1, h2, body1, etc.)
 */
// @ts-ignore - $iterator patterns are expanded by Babel
export const textStyles = StyleSheet.create((theme: Theme) => ({
    text: ({ color }: TextStyleParams) => ({
        margin: 0,
        padding: 0,
        color: theme.colors.text[color ?? 'primary'] || theme.colors.text.primary,
        variants: {
            // Typography variants - $iterator expands for each typography key
            typography: {
                fontSize: theme.sizes.$typography.fontSize,
                lineHeight: theme.sizes.$typography.lineHeight,
                fontWeight: theme.sizes.$typography.fontWeight,
            },
            weight: {
                light: { fontWeight: '300' },
                normal: { fontWeight: '400' },
                medium: { fontWeight: '500' },
                semibold: { fontWeight: '600' },
                bold: { fontWeight: '700' },
            } as const,
            align: {
                left: { textAlign: 'left' },
                center: { textAlign: 'center' },
                right: { textAlign: 'right' },
            } as const,
            // Spacing variants - $iterator expands for each view size key
            gap: {
                gap: theme.sizes.$view.spacing,
            },
            padding: {
                padding: theme.sizes.$view.padding,
            },
            paddingVertical: {
                paddingVertical: theme.sizes.$view.padding,
            },
            paddingHorizontal: {
                paddingHorizontal: theme.sizes.$view.padding,
            },
        } as const,
        _web: {
            fontFamily: 'inherit',
        },
    }),
}));
