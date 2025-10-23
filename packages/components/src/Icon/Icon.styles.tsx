import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Color, getColorFromString } from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type IconVariants = {
    size: IconSize;
    intent?: Intent;
    color?: Color;
}

export type ExpandedIconStyles = StylesheetStyles<keyof IconVariants>;

export type IconStylesheet = {
    icon: ExpandedIconStyles;
}

/**
 * Create color variants for icon
 */
function getIconColor(theme: Theme, color?: Color, intent?: Intent): string {
    if (intent) {
        return theme.intents[intent]?.primary
    } else if (color) {
        return getColorFromString(theme, color);
    }
    return theme.colors.text.primary;
}

function createIconStyles(theme: Theme, expanded: Partial<ExpandedIconStyles>): ExpandedIconStyles {
    return ({ color, intent }: IconVariants) => {
        return deepMerge({
            width: 24,
            height: 24,
            color: getIconColor(theme, color, intent),
            variants: {
                size: buildSizeVariants(theme, 'icon', (size) => ({
                    width: size.width,
                    height: size.height,
                    fontSize: size.fontSize,
                })),
            },
            _web: {
                display: 'inline-block',
                verticalAlign: 'middle',
                flexShrink: 0,
                lineHeight: 0,
            },
        }, expanded);
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const iconStyles: ReturnType<typeof createIconStylesheet> = StyleSheet.create((theme: Theme) => {
  return {
    icon: createIconStyles(theme, {}),
  };
});

function createIconStylesheet(theme: Theme, expanded?: Partial<IconStylesheet>) {
    return {
        icon: createIconStyles(theme, expanded?.icon || {}),
    };
}
