import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

type TabBarSize = 'sm' | 'md' | 'lg';
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
                backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
            },
        },
        {
            type: 'pills',
            pillMode: 'dark',
            styles: {
                backgroundColor: theme.colors?.surface?.inverse || '#000000',
            },
        },
    ];
}

/**
 * Create size variants for tab
 */
function createTabSizeVariants() {
    return {
        sm: {
            fontSize: 14,
            padding: 8,
            lineHeight: 20,
        },
        md: {
            fontSize: 16,
            padding: 12,
            lineHeight: 24,
        },
        lg: {
            fontSize: 18,
            padding: 16,
            lineHeight: 28,
        },
    };
}

/**
 * Create compound variants for tab
 */
function createTabCompoundVariants(theme: Theme): CompoundVariants<keyof TabBarTabVariants> {
    return [
        // Pills variant - compact padding for all sizes
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
function createLabelSizeVariants() {
    return {
        sm: {
            fontSize: 14,
            lineHeight: 20,
        },
        md: {
            fontSize: 16,
            lineHeight: 24,
        },
        lg: {
            fontSize: 18,
            lineHeight: 28,
        },
    };
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
                color: theme.colors?.text?.primary || '#000000',
            },
        },
        // Pills dark mode - dark text on active (light pill)
        {
            type: 'pills',
            pillMode: 'dark',
            active: true,
            styles: {
                color: theme.colors?.text?.primary || '#000000',
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
                backgroundColor: theme.colors?.surface?.tertiary || '#e0e0e0',
            },
        },
        // Pills dark mode - lighter pill
        {
            type: 'pills',
            pillMode: 'dark',
            styles: {
                backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
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
        borderBottomColor: theme.colors?.border?.primary || '#e0e0e0',
        variants: {
            type: {
                default: {},
                pills: {
                    borderBottomWidth: 0,
                    padding: 4,
                    gap: 4,
                    backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
                    overflow: 'hidden',
                    alignSelf: 'flex-start',
                },
                underline: {},
            },
            size: {
                sm: {},
                md: {},
                lg: {},
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
        fontFamily: theme.typography?.fontFamily?.sans,
        fontWeight: theme.typography?.fontWeight?.medium || '500',
        color: theme.colors?.text?.secondary || '#666666',
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'transparent',
        variants: {
            size: createTabSizeVariants(),
            type: {
                default: {},
                pills: {
                    borderRadius: theme.borderRadius?.full || 9999,
                    marginRight: 0,
                    backgroundColor: 'transparent',
                },
                underline: {},
            },
            active: {
                true: {
                    color: theme.colors?.text?.primary || '#000000',
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
                        ':hover': {
                            color: theme.colors?.text?.primary || '#000000',
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
        fontFamily: theme.typography?.fontFamily?.sans,
        fontWeight: theme.typography?.fontWeight?.medium || '500',
        color: theme.colors?.text?.secondary || '#666666',
        variants: {
            size: createLabelSizeVariants(),
            type: {
                default: {},
                pills: {},
                underline: {},
            },
            active: {
                true: {
                    color: theme.colors?.text?.primary || '#000000',
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
                    borderRadius: theme.borderRadius?.full || 9999,
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
