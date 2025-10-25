import { StyleSheet } from "react-native-unistyles";
import { Theme, StylesheetStyles, Styles, DynamicStyles } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { TextAlignVariant, TextColorVariant, TextSizeVariant, TextWeightVariant } from "./types";

type TextVariants = {
    size: TextSizeVariant;
    weight: TextWeightVariant;
    align: TextAlignVariant;
    color: TextColorVariant;
}

export type TextStylesheet = {
    text: DynamicStyles<keyof TextVariants>;
}

/**
 * Create size variants for text
 */
function createSizeVariants(theme: Theme): any {
    return buildSizeVariants(theme, 'text', (size) => ({
        fontSize: size.fontSize,
        lineHeight: size.lineHeight,
    }));
}

function createTextStyles(theme: Theme) {
    return ({ color }: Partial<TextVariants>) => {
        const colorValue = theme.colors.text[color] || theme.colors.text.primary;
        return {
            margin: 0,
            padding: 0,
            color: colorValue,
            variants: {
                size: createSizeVariants(theme) as any,
                weight: {
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
                } as const,
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
                } as const,
            } as const,
            _web: {
                fontFamily: 'inherit',
                lineHeight: 'inherit',
            },
        } as const;
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const textStyles = StyleSheet.create((theme: Theme) => {
  return {
        text: createTextStyles(theme),
    } as TextStylesheet;
});