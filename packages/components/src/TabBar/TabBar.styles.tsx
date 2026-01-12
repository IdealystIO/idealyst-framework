/**
 * TabBar styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type TabBarType = 'standard' | 'underline' | 'pills';
type TabBarPillMode = 'light' | 'dark';
type TabBarIconPosition = 'left' | 'top';
type TabBarJustify = 'start' | 'center' | 'equal' | 'space-between';

export type TabBarDynamicProps = {
    size?: Size;
    type?: TabBarType;
    pillMode?: TabBarPillMode;
    active?: boolean;
    disabled?: boolean;
    iconPosition?: TabBarIconPosition;
    justify?: TabBarJustify;
    gap?: ViewStyleSize;
    padding?: ViewStyleSize;
    paddingVertical?: ViewStyleSize;
    paddingHorizontal?: ViewStyleSize;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * TabBar styles with type/pillMode/active handling.
 */
export const tabBarStyles = defineStyle('TabBar', (theme: Theme) => ({
    container: ({ type = 'standard', pillMode = 'light', justify = 'start' }: TabBarDynamicProps) => {
        const backgroundColor = type === 'pills'
            ? (pillMode === 'dark' ? theme.colors.surface.inverse : theme.colors.surface.secondary)
            : undefined;

        const justifyContent = {
            start: 'flex-start',
            center: 'center',
            equal: 'stretch',
            'space-between': 'space-between',
        }[justify];

        return {
            display: 'flex' as const,
            flexDirection: 'row' as const,
            gap: type === 'pills' ? 4 : 0,
            position: 'relative' as const,
            borderBottomWidth: type === 'pills' ? 0 : 1,
            borderBottomStyle: 'solid' as const,
            borderBottomColor: theme.colors.border.primary,
            padding: type === 'pills' ? 4 : undefined,
            backgroundColor: backgroundColor || (type === 'pills' ? theme.colors.surface.secondary : undefined),
            overflow: type === 'pills' ? ('hidden' as const) : undefined,
            alignSelf: type === 'pills' ? ('flex-start' as const) : undefined,
            width: type === 'pills' ? undefined : '100%',
            borderRadius: type === 'pills' ? 9999 : undefined,
            justifyContent: justifyContent as any,
            variants: {
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
        } as const;
    },

    tab: ({ type = 'standard', size = 'md', active = false, pillMode: _pillMode = 'light', disabled = false, iconPosition = 'left', justify = 'start' }: TabBarDynamicProps) => {
        // Tab padding for pills
        const paddingMap: Record<Size, { paddingVertical: number; paddingHorizontal: number }> = {
            xs: { paddingVertical: 2, paddingHorizontal: 10 },
            sm: { paddingVertical: 4, paddingHorizontal: 12 },
            md: { paddingVertical: 6, paddingHorizontal: 16 },
            lg: { paddingVertical: 8, paddingHorizontal: 20 },
            xl: { paddingVertical: 10, paddingHorizontal: 24 },
        };
        const tabPadding = type === 'pills' ? paddingMap[size] : {};

        // Color based on type and active state
        let color = active ? theme.colors.text.primary : theme.colors.text.secondary;
        if (active) {
            if (type === 'pills') color = theme.intents.primary.contrast;
            else if (type === 'underline') color = theme.intents.primary.primary;
        }

        return {
            display: 'flex' as const,
            flexDirection: iconPosition === 'top' ? ('column' as const) : ('row' as const),
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            fontWeight: '500' as const,
            flex: justify === 'equal' ? 1 : undefined,
            color,
            position: 'relative' as const,
            zIndex: 2,
            backgroundColor: 'transparent' as const,
            gap: 6,
            borderRadius: type === 'pills' ? 9999 : undefined,
            opacity: disabled ? 0.5 : 1,
            ...tabPadding,
            variants: {
                size: {
                    fontSize: theme.sizes.$tabBar.fontSize,
                    padding: theme.sizes.$tabBar.padding,
                    lineHeight: theme.sizes.$tabBar.lineHeight,
                },
            },
            _web: {
                border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                outline: 'none',
                transition: 'color 0.2s ease',
                _hover: disabled ? {} : { color: theme.colors.text.primary },
            },
        } as const;
    },

    tabLabel: ({ type = 'standard', active = false, pillMode: _pillMode = 'light', disabled = false }: TabBarDynamicProps) => {
        let color = active ? theme.colors.text.primary : theme.colors.text.secondary;
        if (active) {
            if (type === 'pills') color = theme.colors.text.primary;
            else if (type === 'underline') color = theme.intents.primary.primary;
        }

        return {
            position: 'relative' as const,
            zIndex: 3,
            fontWeight: '500' as const,
            color,
            opacity: disabled ? 0.5 : 1,
            variants: {
                size: {
                    fontSize: theme.sizes.$tabBar.fontSize,
                    lineHeight: theme.sizes.$tabBar.lineHeight,
                },
            },
        } as const;
    },

    tabIcon: ({ active: _active = false, disabled = false, iconPosition = 'left' }: TabBarDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        opacity: disabled ? 0.5 : 1,
        marginBottom: iconPosition === 'top' ? 2 : 0,
        variants: {
            size: {
                width: theme.sizes.$tabBar.fontSize,
                height: theme.sizes.$tabBar.fontSize,
            },
        },
    }),

    indicator: ({ type = 'standard', pillMode = 'light' }: TabBarDynamicProps) => {
        const backgroundColor = type === 'pills'
            ? (pillMode === 'dark' ? theme.colors.surface.secondary : theme.colors.surface.tertiary)
            : theme.intents.primary.primary;

        const typeStyles = type === 'pills' ? {
            borderRadius: 9999,
            bottom: 4,
            top: 4,
            left: 0,
        } : {
            bottom: -1,
            height: 2,
        };

        return {
            position: 'absolute' as const,
            pointerEvents: 'none' as const,
            zIndex: 1,
            backgroundColor,
            ...typeStyles,
            _web: {
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            },
        } as const;
    },
}));

// Export individual style sheets for backwards compatibility
export const tabBarContainerStyles = tabBarStyles;
export const tabBarTabStyles = tabBarStyles;
export const tabBarLabelStyles = tabBarStyles;
export const tabBarIndicatorStyles = tabBarStyles;
export const tabBarIconStyles = tabBarStyles;
