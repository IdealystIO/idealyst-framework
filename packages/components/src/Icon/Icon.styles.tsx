/**
 * Icon styles using defineStyle with dynamic functions.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper, getColorFromString } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Color, Text } from '@idealyst/theme';
import { IconSizeVariant } from './types';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type IconVariants = {
    size: IconSizeVariant;
    intent?: Intent;
    color?: Color;
    textColor?: Text;
};

export type IconDynamicProps = Partial<IconVariants>;

/**
 * Icon styles with dynamic color/size handling.
 */
export const iconStyles = defineStyle('Icon', (theme: Theme) => ({
    icon: ({ color, textColor, intent, size = 'md' }: IconDynamicProps) => {
        // Handle size - can be a named size or number
        let iconWidth: number;
        let iconHeight: number;

        if (typeof size === 'number') {
            iconWidth = size;
            iconHeight = size;
        } else {
            const sizeKey = size || 'md';
            const iconSize = theme.sizes.icon[sizeKey];
            if (typeof iconSize === 'number') {
                iconWidth = iconSize;
                iconHeight = iconSize;
            } else {
                iconWidth = (iconSize?.width as number) ?? 24;
                iconHeight = (iconSize?.height as number) ?? 24;
            }
        }

        // Get color - priority: intent > color > textColor > default
        // color takes precedence over textColor (as per design)
        const iconColor = intent
            ? theme.intents[intent]?.primary
            : color
                ? getColorFromString(theme as unknown as BaseTheme, color)
                : textColor
                    ? theme.colors.text[textColor]
                    : theme.colors.text.primary;

        return {
            width: iconWidth,
            height: iconHeight,
            color: iconColor,
            _web: {
                fontSize: iconWidth,
                width: '1em',
                height: '1em',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                verticalAlign: 'middle',
                flexShrink: 0,
                lineHeight: 1,
            },
        } as const;
    },
}));
