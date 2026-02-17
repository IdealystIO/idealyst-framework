import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source
void StyleSheet;

type Theme = ThemeStyleWrapper<BaseTheme>;

export type GridVariants = {
    gap: ViewStyleSize;
    padding: ViewStyleSize;
    paddingVertical: ViewStyleSize;
    paddingHorizontal: ViewStyleSize;
    margin: ViewStyleSize;
    marginVertical: ViewStyleSize;
    marginHorizontal: ViewStyleSize;
};

export const gridStyles = defineStyle('Grid', (theme: Theme) => ({
    grid: {
        // Theme marker for Unistyles reactivity
        borderColor: theme.colors.border.primary,
        borderWidth: 0,
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        variants: {
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
            margin: {
                margin: theme.sizes.$view.padding,
            },
            marginVertical: {
                marginVertical: theme.sizes.$view.padding,
            },
            marginHorizontal: {
                marginHorizontal: theme.sizes.$view.padding,
            },
        },
        _web: {
            display: 'grid',
            boxSizing: 'border-box',
        },
    },
}));
