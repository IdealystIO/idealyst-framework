import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type MenuSize = 'sm' | 'md' | 'lg';
type MenuIntent = Intent;

type MenuVariants = {
    size: MenuSize;
    intent: MenuIntent;
    disabled: boolean;
}

export type ExpandedMenuStyles = StylesheetStyles<keyof MenuVariants>;

export type MenuStylesheet = {
    overlay: ExpandedMenuStyles;
    menu: ExpandedMenuStyles;
    separator: ExpandedMenuStyles;
    item: ExpandedMenuStyles;
    icon: ExpandedMenuStyles;
    label: ExpandedMenuStyles;
}

/**
 * Create size variants for menu item
 */
function createItemSizeVariants(theme: Theme) {
    return {
        sm: {
            paddingVertical: theme.spacing?.xs || 4,
            paddingHorizontal: theme.spacing?.sm || 8,
        },
        md: {
            paddingVertical: theme.spacing?.sm || 8,
            paddingHorizontal: theme.spacing?.md || 16,
        },
        lg: {
            paddingVertical: theme.spacing?.md || 16,
            paddingHorizontal: theme.spacing?.lg || 24,
        },
    };
}

/**
 * Create intent variants for menu item
 */
function createItemIntentVariants(theme: Theme) {
    const variants: Record<MenuIntent, any> = {} as any;
    for (const intent in theme.intents) {
        const intentKey = intent as MenuIntent;
        const intentValue = theme.intents[intentKey];

        if (intentKey === 'neutral') {
            variants[intentKey] = {};
        } else {
            variants[intentKey] = {
                _web: {
                    ':hover': {
                        backgroundColor: intentValue.container || intentValue.primary + '20',
                        color: intentValue.primary,
                    },
                },
            };
        }
    }
    return variants;
}

/**
 * Create compound variants for menu item
 */
function createItemCompoundVariants(theme: Theme): CompoundVariants<keyof MenuVariants> {
    return [
        {
            disabled: true,
            styles: {
                _web: {
                    ':hover': {
                        backgroundColor: 'transparent',
                    },
                },
            },
        },
    ];
}

/**
 * Create size variants for icon
 */
function createIconSizeVariants() {
    return {
        sm: {
            width: 16,
            height: 16,
            fontSize: 16,
        },
        md: {
            width: 20,
            height: 20,
            fontSize: 20,
        },
        lg: {
            width: 24,
            height: 24,
            fontSize: 24,
        },
    };
}

/**
 * Create size variants for label
 */
function createLabelSizeVariants() {
    return {
        sm: { fontSize: 14 },
        md: { fontSize: 16 },
        lg: { fontSize: 18 },
    };
}

const createOverlayStyles = (theme: Theme, expanded: Partial<ExpandedMenuStyles>): ExpandedMenuStyles => {
    return deepMerge({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: 'transparent',
    }, expanded);
}

const createMenuStyles = (theme: Theme, expanded: Partial<ExpandedMenuStyles>): ExpandedMenuStyles => {
    return deepMerge({
        position: 'absolute',
        zIndex: 1000,
        backgroundColor: theme.colors?.surface?.elevated || '#ffffff',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors?.border?.primary || '#e0e0e0',
        borderRadius: theme.borderRadius?.md || 8,
        minWidth: 120,
        maxWidth: 400,
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        _web: {
            border: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: 'fit-content',
        },
    }, expanded);
}

const createSeparatorStyles = (theme: Theme, expanded: Partial<ExpandedMenuStyles>): ExpandedMenuStyles => {
    return deepMerge({
        height: 1,
        backgroundColor: theme.colors?.border?.primary || '#e0e0e0',
        marginTop: 4,
        marginBottom: 4,
    }, expanded);
}

const createItemStyles = (theme: Theme, expanded: Partial<ExpandedMenuStyles>): ExpandedMenuStyles => {
    return deepMerge({
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: theme.borderRadius?.sm || 4,
        minHeight: 44,
        variants: {
            size: createItemSizeVariants(theme),
            intent: createItemIntentVariants(theme),
            disabled: {
                true: {
                    opacity: 0.5,
                    _web: {
                        cursor: 'not-allowed',
                    },
                },
                false: {},
            },
        },
        compoundVariants: createItemCompoundVariants(theme),
        _web: {
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            transition: 'background-color 0.2s ease',
            textAlign: 'left',
            ':hover': {
                backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
            },
        },
    }, expanded);
}

const createIconStyles = (theme: Theme, expanded: Partial<ExpandedMenuStyles>): ExpandedMenuStyles => {
    return deepMerge({
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginRight: theme.spacing?.sm || 8,
        variants: {
            size: createIconSizeVariants(),
        },
    }, expanded);
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedMenuStyles>): ExpandedMenuStyles => {
    return deepMerge({
        flex: 1,
        color: theme.colors?.text?.primary || '#000000',
        variants: {
            size: createLabelSizeVariants(),
        },
    }, expanded);
}

export const createMenuStylesheet = (theme: Theme, expanded?: Partial<MenuStylesheet>): MenuStylesheet => {
    return {
        overlay: createOverlayStyles(theme, expanded?.overlay || {}),
        menu: createMenuStyles(theme, expanded?.menu || {}),
        separator: createSeparatorStyles(theme, expanded?.separator || {}),
        item: createItemStyles(theme, expanded?.item || {}),
        icon: createIconStyles(theme, expanded?.icon || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
    };
}
