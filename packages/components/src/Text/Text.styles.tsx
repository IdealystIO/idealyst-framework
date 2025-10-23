import { StyleSheet } from "react-native-unistyles";
import { Theme, StylesheetStyles, Size, Color } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type TextSize = Size;
type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';

type TextVariants = {
    size: TextSize;
    weight: TextWeight;
    align: TextAlign;
    color: Color;
}

export type ExpandedTextStyles = StylesheetStyles<keyof TextVariants>;

export type TextStylesheet = {
    text: ExpandedTextStyles;
}

/**
 * Create size variants for text
 */
function createSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'text', (size) => ({
        fontSize: size.fontSize,
        lineHeight: size.lineHeight,
    }));
}

/**
 * Create weight variants for text
 */
function createWeightVariants() {
    // TODO: Add typography to theme
    return {
        light: {
            fontWeight: '300',
        },
        normal: {
            fontWeight: '400',
        },
        medium: {
            fontWeight: '500',
        },
        semibold: {
            fontWeight: '600',
        },
        bold: {
            fontWeight: '700',
        },
    };
}

/**
 * Create color variants for text
 */
function createColorVariants(theme: Theme) {
    const variants: Record<Color, any> = {} as any;
    for (const color in theme.colors) {
        variants[color as Color] = {
            color: theme.colors[color as Color],
        };
    }
    return variants;
}

function createTextStyles(theme: Theme) {
    return ({ color }: TextVariants) => {
        const colorValue = theme.colors.text[color] || theme.colors.text.primary;
        return {
            margin: 0,
            padding: 0,
            color: colorValue,
            variants: {
                size: createSizeVariants(theme),
                weight: createWeightVariants(),
                align: {
                    left: {
                        textAlign: 'left',
                    },
                    center: {
                        textAlign: 'center',
                    },
                    right: {
                        textAlign: 'right',
                    },
                },
            },
            _web: {
                fontFamily: 'inherit',
                lineHeight: 'inherit',
            },
        };
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const textStyles = StyleSheet.create((theme: Theme) => {
  return {
        text: createTextStyles(theme),
    }
});