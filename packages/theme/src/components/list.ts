import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

type ListSize = 'sm' | 'md' | 'lg';
type ListType = 'default' | 'bordered' | 'divided';

type ListVariants = {
    size: ListSize;
    type: ListType;
    scrollable: boolean;
    active: boolean;
    selected: boolean;
    disabled: boolean;
    clickable: boolean;
}

export type ExpandedListStyles = StylesheetStyles<keyof ListVariants>;

export type ListStylesheet = {
    container: ExpandedListStyles;
    item: ExpandedListStyles;
    itemContent: ExpandedListStyles;
    leading: ExpandedListStyles;
    labelContainer: ExpandedListStyles;
    label: ExpandedListStyles;
    trailing: ExpandedListStyles;
    trailingIcon: ExpandedListStyles;
    section: ExpandedListStyles;
    sectionTitle: ExpandedListStyles;
    sectionContent: ExpandedListStyles;
}

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        default: {
            backgroundColor: 'transparent',
        },
        bordered: {
            backgroundColor: theme.colors?.surface?.primary || '#ffffff',
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors?.border?.primary || '#e0e0e0',
            borderRadius: theme.borderRadius?.md || 8,
            overflow: 'hidden',
            _web: {
                border: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            },
        },
        divided: {
            backgroundColor: 'transparent',
        },
    };
}

/**
 * Create size variants for item
 */
function createItemSizeVariants(theme: Theme) {
    return {
        sm: {
            paddingTop: theme.spacing?.xs || 4,
            paddingBottom: theme.spacing?.xs || 4,
            paddingLeft: theme.spacing?.sm || 8,
            paddingRight: theme.spacing?.sm || 8,
            minHeight: 32,
        },
        md: {
            padding: theme.spacing?.md || 16,
            minHeight: 44,
        },
        lg: {
            padding: theme.spacing?.lg || 24,
            minHeight: 52,
        },
    };
}

/**
 * Create type variants for item
 */
function createItemTypeVariants(theme: Theme) {
    return {
        default: {},
        bordered: {},
        divided: {
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: theme.colors?.border?.primary || '#e0e0e0',
            _web: {
                borderBottom: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            },
        },
    };
}

/**
 * Create compound variants for item
 */
function createItemCompoundVariants(theme: Theme): CompoundVariants<keyof ListVariants> {
    return [
        {
            type: 'divided',
            styles: {
                _web: {
                    ':last-child': {
                        borderBottom: 'none',
                    },
                },
            },
        },
        {
            disabled: true,
            styles: {
                _web: {
                    ':hover': {
                        backgroundColor: 'transparent',
                        borderRadius: 0,
                    },
                },
            },
        },
        {
            clickable: false,
            styles: {
                _web: {
                    ':hover': {
                        backgroundColor: 'transparent',
                        borderRadius: 0,
                    },
                },
            },
        },
    ];
}

/**
 * Create size variants for leading/trailing icons
 */
function createIconSizeVariants() {
    return {
        sm: { width: 16, height: 16 },
        md: { width: 20, height: 20 },
        lg: { width: 24, height: 24 },
    };
}

/**
 * Create size variants for label
 */
function createLabelSizeVariants() {
    return {
        sm: { fontSize: 14, lineHeight: 20 },
        md: { fontSize: 16, lineHeight: 24 },
        lg: { fontSize: 18, lineHeight: 28 },
    };
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        variants: {
            type: createContainerTypeVariants(theme),
            scrollable: {
                true: {
                    overflow: 'auto',
                    _web: {
                        overflowY: 'auto',
                    },
                },
                false: {},
            },
        },
    }, expanded);
}

const createItemStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        textAlign: 'left',
        variants: {
            size: createItemSizeVariants(theme),
            type: createItemTypeVariants(theme),
            active: {
                true: {
                    backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
                },
                false: {},
            },
            selected: {
                true: {
                    backgroundColor: theme.intents.primary.container || theme.intents.primary.primary + '20',
                    borderLeftWidth: 3,
                    borderLeftColor: theme.intents.primary.primary,
                    _web: {
                        borderLeft: `3px solid ${theme.intents.primary.primary}`,
                    },
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
                false: {},
            },
            clickable: {
                true: {},
                false: {
                    _web: {
                        cursor: 'default',
                    },
                },
            },
        },
        compoundVariants: createItemCompoundVariants(theme),
        _web: {
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
            ':hover': {
                backgroundColor: theme.colors?.interactive?.hover || theme.colors?.surface?.secondary || '#f5f5f5',
                borderRadius: theme.borderRadius?.sm || 4,
            },
        },
    }, expanded);
}

const createItemContentStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: theme.spacing?.sm || 8,
    }, expanded);
}

const createLeadingStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing?.sm || 8,
        color: theme.colors?.text?.secondary || '#666666',
        variants: {
            size: createIconSizeVariants(),
        },
    }, expanded);
}

const createLabelContainerStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    }, expanded);
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        fontFamily: theme.typography?.fontFamily?.sans,
        fontWeight: theme.typography?.fontWeight?.medium || '500',
        color: theme.colors?.text?.primary || '#000000',
        variants: {
            size: createLabelSizeVariants(),
            disabled: {
                true: {
                    color: theme.colors?.text?.disabled || '#999999',
                },
                false: {},
            },
            selected: {
                true: {
                    color: theme.intents.primary.primary,
                    fontWeight: theme.typography?.fontWeight?.semibold || '600',
                },
                false: {},
            },
        },
    }, expanded);
}

const createTrailingStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: theme.spacing?.sm || 8,
        color: theme.colors?.text?.secondary || '#666666',
        flexShrink: 0,
    }, expanded);
}

const createTrailingIconStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            size: createIconSizeVariants(),
        },
    }, expanded);
}

const createSectionStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'column',
    }, expanded);
}

const createSectionTitleStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        fontFamily: theme.typography?.fontFamily?.sans,
        fontWeight: theme.typography?.fontWeight?.semibold || '600',
        fontSize: 12,
        lineHeight: 16,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        color: theme.colors?.text?.secondary || '#666666',
        padding: theme.spacing?.sm || 8,
        paddingBottom: theme.spacing?.xs || 4,
    }, expanded);
}

const createSectionContentStyles = (theme: Theme, expanded: Partial<ExpandedListStyles>): ExpandedListStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'column',
    }, expanded);
}

export const createListStylesheet = (theme: Theme, expanded?: Partial<ListStylesheet>): ListStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        item: createItemStyles(theme, expanded?.item || {}),
        itemContent: createItemContentStyles(theme, expanded?.itemContent || {}),
        leading: createLeadingStyles(theme, expanded?.leading || {}),
        labelContainer: createLabelContainerStyles(theme, expanded?.labelContainer || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
        trailing: createTrailingStyles(theme, expanded?.trailing || {}),
        trailingIcon: createTrailingIconStyles(theme, expanded?.trailingIcon || {}),
        section: createSectionStyles(theme, expanded?.section || {}),
        sectionTitle: createSectionTitleStyles(theme, expanded?.sectionTitle || {}),
        sectionContent: createSectionContentStyles(theme, expanded?.sectionContent || {}),
    };
}
