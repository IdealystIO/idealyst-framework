/**
 * ScrollView styles using defineStyle with $iterator expansion.
 * Reuses the same visual variant patterns as View.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';
import { ScrollViewBackgroundVariant, ScrollViewBorderVariant, ScrollViewRadiusVariant } from './types';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type ScrollViewVariants = {
    background: ScrollViewBackgroundVariant;
    radius: ScrollViewRadiusVariant;
    border: ScrollViewBorderVariant;
    gap: ViewStyleSize;
    padding: ViewStyleSize;
    paddingVertical: ViewStyleSize;
    paddingHorizontal: ViewStyleSize;
    margin: ViewStyleSize;
    marginVertical: ViewStyleSize;
    marginHorizontal: ViewStyleSize;
};

export type ScrollViewDynamicProps = Partial<ScrollViewVariants>;

export const scrollViewStyles = defineStyle('ScrollView', (theme: Theme) => ({
    container: (_props: ScrollViewDynamicProps) => ({
        display: 'flex' as const,
        flex: 1,
        borderColor: theme.colors.border.primary,
        borderWidth: 0,
        variants: {
            background: {
                backgroundColor: theme.colors.$surface,
            },
            radius: {
                none: { borderRadius: 0 },
                xs: { borderRadius: 2 },
                sm: { borderRadius: 4 },
                md: { borderRadius: 8 },
                lg: { borderRadius: 12 },
                xl: { borderRadius: 16 },
            },
            border: {
                none: { borderWidth: 0 },
                thin: { borderWidth: 1, borderStyle: 'solid' as const, borderColor: theme.colors.pallet.gray[300] },
                thick: { borderWidth: 2, borderStyle: 'solid' as const, borderColor: theme.colors.pallet.gray[300] },
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
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            borderStyle: 'solid',
            position: 'relative',
            minHeight: 0,
        },
    }),
    contentContainer: (_props: ScrollViewDynamicProps) => ({
        borderColor: theme.colors.border.primary,
        borderWidth: 0,
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
        },
        _web: {
            boxSizing: 'border-box',
        },
    }),
    // Web-only: the actual scrolling element (absolute positioned within container)
    scrollableRegion: {
        _web: {
            position: 'absolute',
            inset: 0,
            overflow: 'auto',
            boxSizing: 'border-box',
        },
    },
}));
