import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { Color } from "../theme/colors";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type IconVariants = {
    size: IconSize;
    intent: Intent;
    color: Color;
}

export type ExpandedIconStyles = StylesheetStyles<keyof IconVariants>;

export type IconStylesheet = {
    icon: ExpandedIconStyles;
}


/**
 * Create intent variants for icon
 */
function createIconIntentVariants(theme: Theme) {
    const variants: any = {};
    for (const intent in theme.intents) {
        variants[intent] = {
            color: theme.intents[intent as Intent].primary,
        };
    }
    return variants;
}

/**
 * Create color variants for icon
 */
function createIconColorVariants(theme: Theme) {
    const variants: Record<Color, any> = {} as any;
    for (const color in theme.colors) {
        variants[color as Color] = {
            color: theme.colors[color as Color],
        };
    }
    return variants;
}

const createIconStyles = (theme: Theme, expanded: Partial<ExpandedIconStyles>): ExpandedIconStyles => {
    return deepMerge({
        width: 24,
        height: 24,
        color: theme.colors['gray.900'], // TODO: Add text colors to theme
        variants: {
            size: buildSizeVariants(theme, 'icon', (size) => ({
                width: size.width,
                height: size.height,
                fontSize: size.fontSize,
            })),
            intent: createIconIntentVariants(theme),
            color: createIconColorVariants(theme),
        },
        _web: {
            display: 'inline-block',
            verticalAlign: 'middle',
            flexShrink: 0,
            lineHeight: 0,
        },
    }, expanded);
}

export const createIconStylesheet = (theme: Theme, expanded?: Partial<IconStylesheet>): IconStylesheet => {
    return {
        icon: createIconStyles(theme, expanded?.icon || {}),
    };
}
