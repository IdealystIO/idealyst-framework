import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent, Color, getColorFromString } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { IconSizeVariant } from './types';

type IconVariants = {
    size: IconSizeVariant;
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

function buildIconSize(theme: Theme, size?: IconSizeVariant) {
    // Handle direct numeric sizes
    if (typeof size === 'number') {
        return {
            width: size,
            height: size,
        };
    }

    // Default to 'md' if size is undefined
    const sizeKey = size || 'md';
    const iconSize = theme.sizes.icon[sizeKey];

    if (typeof iconSize === 'number') {
        return {
            width: iconSize,
            height: iconSize,
        };
    }

    return buildSizeVariants(theme, 'icon', (size) => ({
        width: size.width,
        height: size.height,
    }))[sizeKey];
}

function createIconStyles(theme: Theme) {
    return ({ color, intent, size }: Partial<IconVariants>) => {
        const iconSize = buildIconSize(theme, size);
        return {
            width: iconSize.width,
            height: iconSize.height,
            color: getIconColor(theme, color, intent),
            _web: {
                display: 'inline-block',
                verticalAlign: 'middle',
                flexShrink: 0,
                lineHeight: 0,
            },
        } as const;
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const iconStyles = StyleSheet.create((theme: Theme) => {
  return {
    icon: createIconStyles(theme),
  } as const;
});