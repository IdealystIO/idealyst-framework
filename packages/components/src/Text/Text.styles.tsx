import { StyleSheet } from "react-native-unistyles";
import { Theme, Typography } from '@idealyst/theme';
import {
  buildGapVariants,
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { TextAlignVariant, TextColorVariant, TextWeightVariant, TextTypographyVariant } from "./types";
import { applyExtensions } from '../extensions/applyExtension';

export type TextVariants = {
    typography: TextTypographyVariant;
    weight: TextWeightVariant;
    align: TextAlignVariant;
}

/**
 * Create typography variants from theme
 */
function createTypographyVariants(theme: Theme) {
    const variants: Record<string, object> = {};

    for (const key in theme.sizes.typography) {
        const typo = theme.sizes.typography[key as Typography];
        variants[key] = {
            fontSize: typo.fontSize,
            lineHeight: typo.lineHeight,
            fontWeight: typo.fontWeight,
        };
    }

    return variants;
}

type TextStyleParams = {
    color?: TextColorVariant;
}

function createTextStyles(theme: Theme) {
    return ({ color }: TextStyleParams) => {
        const colorValue = theme.colors.text[color ?? 'primary'] || theme.colors.text.primary;

        return {
            margin: 0,
            padding: 0,
            color: colorValue,
            variants: {
                typography: createTypographyVariants(theme),
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
            },
        };
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const textStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('Text', theme, {
        text: createTextStyles(theme),
    });

    return {
        ...extended,
    };
});
