/**
 * TabBar styles using defineStyle with static variants + compoundVariants.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type TabBarVariants = {
    size?: ViewStyleSize;
    type?: 'standard' | 'underline' | 'pills';
    pillMode?: 'light' | 'dark';
    active?: boolean;
    disabled?: boolean;
    iconPosition?: 'left' | 'top';
    justify?: 'start' | 'center' | 'equal' | 'space-between';
    gap?: ViewStyleSize;
    padding?: ViewStyleSize;
    paddingVertical?: ViewStyleSize;
    paddingHorizontal?: ViewStyleSize;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * TabBar styles with static variants and compoundVariants.
 */
export const tabBarStyles = defineStyle('TabBar', (theme: Theme) => ({
    container: {
        display: 'flex' as const,
        flexDirection: 'row' as const,
        position: 'relative' as const,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid' as const,
        borderBottomColor: theme.colors.border.primary,
        width: '100%',
        variants: {
            type: {
                standard: {},
                underline: {},
                pills: {
                    gap: 4,
                    borderBottomWidth: 0,
                    padding: 4,
                    backgroundColor: theme.colors.surface.secondary,
                    overflow: 'hidden' as const,
                    alignSelf: 'flex-start' as const,
                    width: undefined,
                    borderRadius: 9999,
                },
            },
            justify: {
                start: { justifyContent: 'flex-start' as const },
                center: { justifyContent: 'center' as const },
                equal: { justifyContent: 'stretch' as const },
                'space-between': { justifyContent: 'space-between' as const },
            },
            gap: {
                gap: theme.sizes.$view.padding,
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
        compoundVariants: [
            { type: 'pills', pillMode: 'dark', styles: { backgroundColor: theme.colors.surface.inverse } },
        ],
    },

    tab: {
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        fontWeight: '500' as const,
        color: theme.colors.text.secondary,
        position: 'relative' as const,
        zIndex: 2,
        backgroundColor: 'transparent' as const,
        gap: 6,
        opacity: 0.9,
        variants: {
            size: {
                fontSize: theme.sizes.$tabBar.fontSize,
                lineHeight: theme.sizes.$tabBar.lineHeight,
                paddingTop: theme.sizes.$tabBar.padding,
                paddingBottom: theme.sizes.$tabBar.padding,
                paddingLeft: theme.sizes.$tabBar.padding,
                paddingRight: theme.sizes.$tabBar.padding,
            },
            type: {
                standard: {},
                underline: {},
                pills: {
                    borderRadius: 9999,
                },
            },
            active: {
                true: {
                    color: theme.colors.text.primary,
                    opacity: 1,
                },
                false: {},
            },
            disabled: {
                true: { opacity: 0.5 },
                false: {},
            },
            iconPosition: {
                top: { flexDirection: 'column' as const },
                left: { flexDirection: 'row' as const },
            },
            justify: {
                start: {},
                center: {},
                equal: { flex: 1 },
                'space-between': {},
            },
        },
        compoundVariants: [
            // Active + underline: use primary intent color
            { type: 'underline', active: true, styles: { color: theme.intents.primary.primary } },
            // Active + pills: use contrast color
            { type: 'pills', active: true, styles: { color: theme.intents.primary.contrast } },
            // Pills type: tighter padding per size (from theme)
            { type: 'pills', size: 'xs', styles: { paddingTop: theme.sizes.tabBar.xs.pillPaddingVertical, paddingBottom: theme.sizes.tabBar.xs.pillPaddingVertical, paddingLeft: theme.sizes.tabBar.xs.pillPaddingHorizontal, paddingRight: theme.sizes.tabBar.xs.pillPaddingHorizontal } },
            { type: 'pills', size: 'sm', styles: { paddingTop: theme.sizes.tabBar.sm.pillPaddingVertical, paddingBottom: theme.sizes.tabBar.sm.pillPaddingVertical, paddingLeft: theme.sizes.tabBar.sm.pillPaddingHorizontal, paddingRight: theme.sizes.tabBar.sm.pillPaddingHorizontal } },
            { type: 'pills', size: 'md', styles: { paddingTop: theme.sizes.tabBar.md.pillPaddingVertical, paddingBottom: theme.sizes.tabBar.md.pillPaddingVertical, paddingLeft: theme.sizes.tabBar.md.pillPaddingHorizontal, paddingRight: theme.sizes.tabBar.md.pillPaddingHorizontal } },
            { type: 'pills', size: 'lg', styles: { paddingTop: theme.sizes.tabBar.lg.pillPaddingVertical, paddingBottom: theme.sizes.tabBar.lg.pillPaddingVertical, paddingLeft: theme.sizes.tabBar.lg.pillPaddingHorizontal, paddingRight: theme.sizes.tabBar.lg.pillPaddingHorizontal } },
            { type: 'pills', size: 'xl', styles: { paddingTop: theme.sizes.tabBar.xl.pillPaddingVertical, paddingBottom: theme.sizes.tabBar.xl.pillPaddingVertical, paddingLeft: theme.sizes.tabBar.xl.pillPaddingHorizontal, paddingRight: theme.sizes.tabBar.xl.pillPaddingHorizontal } },
        ],
        _web: {
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            transition: 'color 0.2s ease, opacity 0.2s ease',
        },
    },

    tabLabel: {
        position: 'relative' as const,
        zIndex: 3,
        fontWeight: '500' as const,
        color: theme.colors.text.secondary,
        variants: {
            size: {
                fontSize: theme.sizes.$tabBar.fontSize,
                lineHeight: theme.sizes.$tabBar.lineHeight,
            },
            active: {
                true: { color: theme.colors.text.primary },
                false: {},
            },
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
        compoundVariants: [
            { type: 'underline', active: true, styles: { color: theme.intents.primary.primary } },
            { type: 'pills', active: true, styles: { color: theme.colors.text.primary } },
        ],
    },

    tabIcon: {
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        variants: {
            size: {
                width: theme.sizes.$tabBar.fontSize,
                height: theme.sizes.$tabBar.fontSize,
            },
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
            iconPosition: {
                top: { marginBottom: 2 },
                left: { marginBottom: 0 },
            },
        },
    },

    indicator: {
        position: 'absolute' as const,
        pointerEvents: 'none' as const,
        zIndex: 1,
        backgroundColor: theme.intents.primary.primary,
        bottom: -1,
        height: 2,
        variants: {
            type: {
                standard: {},
                underline: {},
                pills: {
                    borderRadius: 9999,
                    top: 4,
                    bottom: 4,
                    height: undefined,
                    left: 0,
                    backgroundColor: theme.colors.surface.tertiary,
                },
            },
        },
        compoundVariants: [
            { type: 'pills', pillMode: 'dark', styles: { backgroundColor: theme.colors.surface.secondary } },
        ],
        _web: {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
    },
}));

// Export individual style sheets for backwards compatibility
export const tabBarContainerStyles = tabBarStyles;
export const tabBarTabStyles = tabBarStyles;
export const tabBarLabelStyles = tabBarStyles;
export const tabBarIndicatorStyles = tabBarStyles;
export const tabBarIconStyles = tabBarStyles;
