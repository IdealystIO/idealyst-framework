/**
 * View styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';
import { ViewBackgroundVariant, ViewBorderVariant, ViewRadiusVariant } from './types';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type ViewVariants = {
    background: ViewBackgroundVariant;
    radius: ViewRadiusVariant;
    border: ViewBorderVariant;
    gap: ViewStyleSize;
    padding: ViewStyleSize;
    paddingVertical: ViewStyleSize;
    paddingHorizontal: ViewStyleSize;
    margin: ViewStyleSize;
    marginVertical: ViewStyleSize;
    marginHorizontal: ViewStyleSize;
};

export type ViewDynamicProps = Partial<ViewVariants>;

/**
 * View styles with $iterator expansion for spacing variants.
 *
 * NOTE: At least one top-level theme access is required for Unistyles to trace
 * theme dependencies. We use a transparent borderColor as a marker.
 */
export const viewStyles = defineStyle('View', (theme: Theme) => ({
    view: (_props: ViewDynamicProps) => ({
        display: 'flex' as const,
        // Theme marker for Unistyles reactivity (invisible, overridden by variants)
        borderColor: theme.colors.border.primary,
        borderWidth: 0,
        variants: {
            background: {
                transparent: { backgroundColor: 'transparent' },
                primary: { backgroundColor: theme.colors.surface.primary },
                secondary: { backgroundColor: theme.colors.surface.secondary },
                tertiary: { backgroundColor: theme.colors.surface.tertiary },
                inverse: { backgroundColor: theme.colors.surface.inverse },
                'inverse-secondary': { backgroundColor: theme.colors.surface['inverse-secondary'] },
                'inverse-tertiary': { backgroundColor: theme.colors.surface['inverse-tertiary'] },
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
            // $iterator expands for each view size
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
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
    }),
    // Web-only: Wrapper for scrollable view
    scrollableWrapper: {
        _web: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            position: 'relative',
            boxSizing: 'border-box',
            minHeight: 0, // Important for flex children to allow shrinking
        },
    },
}));
