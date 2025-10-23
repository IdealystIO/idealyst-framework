import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, CompoundVariants, Size } from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type TabBarSize = Size;
type TabBarType = 'default' | 'pills' | 'underline';
type PillMode = 'light' | 'dark';

type TabBarContainerVariants = {
    type: TabBarType;
    size: TabBarSize;
    pillMode: PillMode;
}

type TabBarTabVariants = {
    size: TabBarSize;
    type: TabBarType;
    active: boolean;
    disabled: boolean;
    pillMode: PillMode;
}

type TabBarLabelVariants = {
    size: TabBarSize;
    type: TabBarType;
    active: boolean;
    disabled: boolean;
    pillMode: PillMode;
}

type TabBarIndicatorVariants = {
    type: TabBarType;
    pillMode: PillMode;
}

export type ExpandedTabBarContainerStyles = StylesheetStyles<keyof TabBarContainerVariants>;
export type ExpandedTabBarTabStyles = StylesheetStyles<keyof TabBarTabVariants>;
export type ExpandedTabBarLabelStyles = StylesheetStyles<keyof TabBarLabelVariants>;
export type ExpandedTabBarIndicatorStyles = StylesheetStyles<keyof TabBarIndicatorVariants>;

export type TabBarStylesheet = {
    container: ExpandedTabBarContainerStyles;
    tab: ExpandedTabBarTabStyles;
    tabLabel: ExpandedTabBarLabelStyles;
    indicator: ExpandedTabBarIndicatorStyles;
}

/**
 * Create compound variants for container
 */
function createContainerCompoundVariants(theme: Theme): CompoundVariants<keyof TabBarContainerVariants> {
    return [
        {
            type: 'pills',
            pillMode: 'light',
            styles: {
                backgroundColor: theme.colors.surface.secondary,
            },
        },
        {
            type: 'pills',
            pillMode: 'dark',
            styles: {
                backgroundColor: theme.colors.surface.inverse,
            },
        },
    ];
}

/**
 * Create size variants for tab
 */
function createTabSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'tabBar', (size) => ({
        fontSize: size.fontSize,
        padding: size.padding,
        lineHeight: size.lineHeight,
    }));
}

/**
 * Create compound variants for tab
 */
function createTabCompoundVariants(theme: Theme): CompoundVariants<keyof TabBarTabVariants> {
    return [
        // Pills variant - compact padding for all sizes
        {
            type: 'pills',
            size: 'xs',
            styles: {
                paddingVertical: 2,
                paddingHorizontal: 10,
            },
        },
        {
            type: 'pills',
            size: 'sm',
            styles: {
                paddingVertical: 4,
                paddingHorizontal: 12,
            },
        },
        {
            type: 'pills',
            size: 'md',
            styles: {
                paddingVertical: 6,
                paddingHorizontal: 16,
            },
        },
        {
            type: 'pills',
            size: 'lg',
            styles: {
                paddingVertical: 8,
                paddingHorizontal: 20,
            },
        },
        {
            type: 'pills',
            size: 'xl',
            styles: {
                paddingVertical: 10,
                paddingHorizontal: 24,
            },
        },
        // Pills variant - active text color
        {
            type: 'pills',
            active: true,
            styles: {
                color: theme.intents.primary.contrast,
            },
        },
        // Underline variant - active text color
        {
            type: 'underline',
            active: true,
            styles: {
                color: theme.intents.primary.primary,
            },
        },
    ];
}

/**
 * Create size variants for label
 */
function createLabelSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'tabBar', (size) => ({
        fontSize: size.fontSize,
        lineHeight: size.lineHeight,
    }));
}

/**
 * Create compound variants for label
 */
function createLabelCompoundVariants(theme: Theme): CompoundVariants<keyof TabBarLabelVariants> {
    return [
        // Pills light mode - light text on active (dark pill)
        {
            type: 'pills',
            pillMode: 'light',
            active: true,
            styles: {
                color: theme.colors.text.primary,
            },
        },
        // Pills dark mode - dark text on active (light pill)
        {
            type: 'pills',
            pillMode: 'dark',
            active: true,
            styles: {
                color: theme.colors.text.primary,
            },
        },
        // Underline variant - active text color
        {
            type: 'underline',
            active: true,
            styles: {
                color: theme.intents.primary.primary,
            },
        },
    ];
}

/**
 * Create compound variants for indicator
 */
function createIndicatorCompoundVariants(theme: Theme): CompoundVariants<keyof TabBarIndicatorVariants> {
    return [
        // Pills light mode - darker pill
        {
            type: 'pills',
            pillMode: 'light',
            styles: {
                backgroundColor: theme.colors.surface.tertiary,
            },
        },
        // Pills dark mode - lighter pill
        {
            type: 'pills',
            pillMode: 'dark',
            styles: {
                backgroundColor: theme.colors.surface.secondary,
            },
        },
    ];
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedTabBarContainerStyles>): ExpandedTabBarContainerStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        gap: 0,
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors.border.primary,
        variants: {
            type: {
                default: {},
                pills: {
                    borderBottomWidth: 0,
                    padding: 4,
                    gap: 4,
                    backgroundColor: theme.colors.surface.secondary,
                    overflow: 'hidden',
                    alignSelf: 'flex-start',
                },
                underline: {},
            },
            size: {
                xs: {},
                sm: {},
                md: {},
                lg: {},
                xl: {},
            },
            pillMode: {
                light: {},
                dark: {},
            },
        },
        compoundVariants: createContainerCompoundVariants(theme),
    }, expanded);
}

const createTabStyles = (theme: Theme, expanded: Partial<ExpandedTabBarTabStyles>): ExpandedTabBarTabStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '500',
        color: theme.colors.text.secondary,
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'transparent',
        variants: {
            size: createTabSizeVariants(theme),
            type: {
                default: {},
                pills: {
                    borderRadius: 9999,
                    marginRight: 0,
                    backgroundColor: 'transparent',
                },
                underline: {},
            },
            active: {
                true: {
                    color: theme.colors.text.primary,
                },
                false: {},
            },
            disabled: {
                true: {
                    opacity: 0.5,
                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                false: {
                    _web: {
                        _hover: {
                            color: theme.colors.text.primary,
                        },
                    },
                },
            },
            pillMode: {
                light: {},
                dark: {},
            },
        },
        compoundVariants: createTabCompoundVariants(theme),
        _web: {
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            transition: 'color 0.2s ease',
        },
    }, expanded);
}

const createTabLabelStyles = (theme: Theme, expanded: Partial<ExpandedTabBarLabelStyles>): ExpandedTabBarLabelStyles => {
    return deepMerge({
        position: 'relative',
        zIndex: 3,
        fontWeight: '500',
        color: theme.colors.text.secondary,
        variants: {
            size: createLabelSizeVariants(theme),
            type: {
                default: {},
                pills: {},
                underline: {},
            },
            active: {
                true: {
                    color: theme.colors.text.primary,
                },
                false: {},
            },
            disabled: {
                true: {
                    opacity: 0.5,
                },
                false: {},
            },
            pillMode: {
                light: {},
                dark: {},
            },
        },
        compoundVariants: createLabelCompoundVariants(theme),
    }, expanded);
}

const createIndicatorStyles = (theme: Theme, expanded: Partial<ExpandedTabBarIndicatorStyles>): ExpandedTabBarIndicatorStyles => {
    return deepMerge({
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 1,
        variants: {
            type: {
                default: {
                    bottom: -1,
                    height: 2,
                    backgroundColor: theme.intents.primary.primary,
                },
                pills: {
                    borderRadius: 9999,
                    bottom: 4,
                    top: 4,
                    left: 0,
                },
                underline: {
                    bottom: -1,
                    height: 2,
                    backgroundColor: theme.intents.primary.primary,
                },
            },
            pillMode: {
                light: {},
                dark: {},
            },
        },
        compoundVariants: createIndicatorCompoundVariants(theme),
        _web: {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
    }, expanded);
}

export const createTabBarStylesheet = (theme: Theme, expanded?: Partial<TabBarStylesheet>): TabBarStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        tab: createTabStyles(theme, expanded?.tab || {}),
        tabLabel: createTabLabelStyles(theme, expanded?.tabLabel || {}),
        indicator: createIndicatorStyles(theme, expanded?.indicator || {}),
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const tabBarStyles = StyleSheet.create((theme: Theme) => {
    const stylesheet = createTabBarStylesheet(theme);
    return {
        container: stylesheet.container,
        tab: stylesheet.tab,
        tabLabel: stylesheet.tabLabel,
        indicator: stylesheet.indicator,
    };
});

// Export individual style sheets for backwards compatibility
export const tabBarContainerStyles = StyleSheet.create((theme: Theme) => {
    const tabBarStyles = createTabBarStylesheet(theme);
    return {
        container: tabBarStyles.container,
    };
});

export const tabBarTabStyles = StyleSheet.create((theme: Theme) => {
    const tabBarStyles = createTabBarStylesheet(theme);
    return {
        tab: tabBarStyles.tab,
    };
});

export const tabBarLabelStyles = StyleSheet.create((theme: Theme) => {
    const tabBarStyles = createTabBarStylesheet(theme);
    return {
        tabLabel: tabBarStyles.tabLabel,
    };
});

export const tabBarIndicatorStyles = StyleSheet.create((theme: Theme) => {
    const tabBarStyles = createTabBarStylesheet(theme);
    return {
        indicator: tabBarStyles.indicator,
    };
});
