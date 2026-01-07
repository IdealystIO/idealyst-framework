/**
 * Text styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';

// Reference StyleSheet so Unistyles detects this file for processing
// Our Babel plugin transforms defineStyle to StyleSheet.create
void StyleSheet;
import type { Theme as BaseTheme } from '@idealyst/theme';
import type { TextStyle, ViewStyle } from 'react-native';
import { TextAlignVariant, TextColorVariant, TextWeightVariant, TextTypographyVariant } from "./types";

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type TextVariants = {
    typography: TextTypographyVariant;
    weight: TextWeightVariant;
    align: TextAlignVariant;
}

/**
 * All props available to dynamic Text style functions.
 * Extensions and overrides receive these to make conditional styling decisions.
 */
export type TextStyleParams = {
    /** Text color variant */
    color?: TextColorVariant;
    /** Typography variant (h1, h2, body1, etc.) */
    typography?: TextTypographyVariant;
    /** Font weight override */
    weight?: TextWeightVariant;
    /** Text alignment */
    align?: TextAlignVariant;
}

/**
 * Text style definition type for use with extendStyle/overrideStyle.
 */
export interface TextStyleDef {
    text: (params: TextStyleParams) => TextStyle & {
        variants?: {
            typography?: Record<string, TextStyle>;
            weight?: Record<string, TextStyle>;
            align?: Record<string, TextStyle>;
            gap?: Record<string, ViewStyle>;
            padding?: Record<string, ViewStyle>;
            paddingVertical?: Record<string, ViewStyle>;
            paddingHorizontal?: Record<string, ViewStyle>;
        };
    };
}

// Register Text style types for type-safe extendStyle/overrideStyle
declare module '@idealyst/theme' {
    interface ComponentStyleRegistry {
        Text: TextStyleDef;
    }
}

/**
 * Text styles with $iterator expansion.
 *
 * Babel expands:
 * - theme.sizes.$typography.X → all typography keys (h1, h2, body1, etc.)
 * - theme.sizes.$view.X → all view size keys (xs, sm, md, lg, xl)
 */
// @ts-ignore - $iterator patterns are expanded by Babel
export const textStyles = defineStyle('Text', (theme: Theme) => ({
    text: ({ color, typography, weight, align }: TextStyleParams) => ({
        margin: 0,
        padding: 0,
        // Base color - can be overridden by extensions using any of the params
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
