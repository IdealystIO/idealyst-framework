import { StyleSheet } from "react-native-unistyles";
import { Theme } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import {
  buildGapVariants,
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { TextAlignVariant, TextColorVariant, TextSizeVariant, TextWeightVariant, TextTypographyVariant } from "./types";

type TextVariants = {
    size: TextSizeVariant;
    weight: TextWeightVariant;
    align: TextAlignVariant;
}

/**
 * Create size variants for text (legacy)
 * @deprecated Use typography prop instead
 */
function createSizeVariants(theme: Theme): any {
    return buildSizeVariants(theme, 'text', (size) => ({
        fontSize: size.fontSize,
        lineHeight: size.lineHeight,
    }));
}

type TextStyleParams = {
    color?: TextColorVariant;
    typography?: TextTypographyVariant;
}

function createTextStyles(theme: Theme) {
    return ({ color, typography }: TextStyleParams) => {
        const colorValue = theme.colors.text[color] || theme.colors.text.primary;

        // Base styles
        const baseStyles: any = {
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
                // Spacing variants from TextSpacingStyleProps
                gap: buildGapVariants(theme),
                padding: buildPaddingVariants(theme),
                paddingVertical: buildPaddingVerticalVariants(theme),
                paddingHorizontal: buildPaddingHorizontalVariants(theme),
            } as const,
            _web: {
                fontFamily: 'inherit',
                lineHeight: 'inherit',
            },
        };

        // If typography is set, apply typography styles (overrides size/weight variants)
        if (typography && theme.sizes.typography[typography]) {
            const typo = theme.sizes.typography[typography];
            baseStyles.fontSize = typo.fontSize;
            baseStyles.lineHeight = typo.lineHeight;
            baseStyles.fontWeight = typo.fontWeight;
        }

        return baseStyles;
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const textStyles = StyleSheet.create((theme: Theme) => {
  return {
        text: createTextStyles(theme),
    };
});