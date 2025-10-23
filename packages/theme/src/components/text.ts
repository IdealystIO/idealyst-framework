import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Color } from "../theme/colors";
import { Size } from "../theme/size";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

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
function createWeightVariants(theme: Theme) {
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

const createTextStyles = (theme: Theme, expanded: Partial<ExpandedTextStyles>): ExpandedTextStyles => {
    return deepMerge({
        color: theme.colors['gray.900'], // TODO: Add text colors to theme
        margin: 0,
        padding: 0,
        variants: {
            size: createSizeVariants(theme),
            weight: createWeightVariants(theme),
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
            color: createColorVariants(theme),
        },
        _web: {
            fontFamily: 'inherit',
            lineHeight: 'inherit',
        },
    }, expanded);
}

export const createTextStylesheet = (theme: Theme, expanded?: Partial<TextStylesheet>): TextStylesheet => {
    return {
        text: createTextStyles(theme, expanded?.text || {}),
    };
}
