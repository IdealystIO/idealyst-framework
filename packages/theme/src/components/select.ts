import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type SelectSize = 'sm' | 'md' | 'lg';
type SelectType = 'outlined' | 'filled';
type SelectIntent = Intent;

type SelectTriggerVariants = {
    type: SelectType;
    size: SelectSize;
    intent: SelectIntent;
    disabled: boolean;
    error: boolean;
    focused: boolean;
}

type SelectOptionVariants = {
    selected: boolean;
    disabled: boolean;
}

type SelectHelperTextVariants = {
    error: boolean;
}

export type ExpandedSelectTriggerStyles = StylesheetStyles<keyof SelectTriggerVariants>;
export type ExpandedSelectOptionStyles = StylesheetStyles<keyof SelectOptionVariants>;
export type ExpandedSelectHelperTextStyles = StylesheetStyles<keyof SelectHelperTextVariants>;
export type ExpandedSelectStyles = StylesheetStyles<never>;

export type SelectStylesheet = {
    container: ExpandedSelectStyles;
    label: ExpandedSelectStyles;
    trigger: ExpandedSelectTriggerStyles;
    triggerContent: ExpandedSelectStyles;
    triggerText: ExpandedSelectStyles;
    placeholder: ExpandedSelectStyles;
    icon: ExpandedSelectStyles;
    chevron: ExpandedSelectStyles;
    chevronOpen: ExpandedSelectStyles;
    dropdown: ExpandedSelectStyles;
    searchContainer: ExpandedSelectStyles;
    searchInput: ExpandedSelectStyles;
    optionsList: ExpandedSelectStyles;
    option: ExpandedSelectOptionStyles;
    optionContent: ExpandedSelectStyles;
    optionIcon: ExpandedSelectStyles;
    optionText: ExpandedSelectStyles;
    optionTextDisabled: ExpandedSelectStyles;
    helperText: ExpandedSelectHelperTextStyles;
    overlay: ExpandedSelectStyles;
}

/**
 * Create type variants for trigger
 */
function createTriggerTypeVariants(theme: Theme) {
    return {
        outlined: {
            backgroundColor: 'transparent',
            borderColor: theme.colors?.border?.primary || '#e0e0e0',
            _web: {
                border: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            },
        },
        filled: {
            backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
            borderColor: 'transparent',
            _web: {
                border: '1px solid transparent',
            },
        },
    };
}

/**
 * Create size variants for trigger
 */
function createTriggerSizeVariants(theme: Theme) {
    return {
        sm: {
            paddingHorizontal: theme.spacing?.xs || 4,
            minHeight: 36,
        },
        md: {
            paddingHorizontal: theme.spacing?.sm || 8,
            minHeight: 44,
        },
        lg: {
            paddingHorizontal: theme.spacing?.md || 16,
            minHeight: 52,
        },
    };
}

/**
 * Create compound variants for trigger
 */
function createTriggerCompoundVariants(theme: Theme): CompoundVariants<keyof SelectTriggerVariants> {
    const variants: CompoundVariants<keyof SelectTriggerVariants> = [];

    // Outlined + Intent combinations
    for (const intent in theme.intents) {
        if (intent !== 'neutral') {
            const intentKey = intent as SelectIntent;
            variants.push({
                type: 'outlined',
                intent: intentKey,
                styles: {
                    borderColor: theme.intents[intentKey].primary,
                    _web: {
                        border: `1px solid ${theme.intents[intentKey].primary}`,
                    },
                },
            });
        }
    }

    return variants;
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        position: 'relative',
    }, expanded);
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        fontSize: theme.typography?.fontSize?.sm || 14,
        fontWeight: theme.typography?.fontWeight?.medium || '500',
        color: theme.colors?.text?.primary || '#000000',
        marginBottom: theme.spacing?.xs || 4,
    }, expanded);
}

const createTriggerStyles = (theme: Theme, expanded: Partial<ExpandedSelectTriggerStyles>): ExpandedSelectTriggerStyles => {
    return deepMerge({
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing?.sm || 8,
        borderRadius: theme.borderRadius?.md || 8,
        borderWidth: 1,
        borderStyle: 'solid',
        minHeight: 44,
        variants: {
            type: createTriggerTypeVariants(theme),
            size: createTriggerSizeVariants(theme),
            intent: {
                neutral: {},
                primary: {},
                success: {},
                error: {},
                warning: {},
            },
            disabled: {
                true: {
                    opacity: 0.6,
                    _web: {
                        cursor: 'not-allowed',
                        ':hover': {
                            borderColor: theme.colors?.border?.primary || '#e0e0e0',
                        },
                    },
                },
                false: {},
            },
            error: {
                true: {
                    borderColor: theme.intents.error.primary,
                    _web: {
                        border: `1px solid ${theme.intents.error.primary}`,
                    },
                },
                false: {},
            },
            focused: {
                true: {
                    borderColor: theme.intents.primary.primary,
                    _web: {
                        border: `2px solid ${theme.intents.primary.primary}`,
                        outline: 'none',
                    },
                },
                false: {},
            },
        },
        compoundVariants: createTriggerCompoundVariants(theme),
        _web: {
            cursor: 'pointer',
            display: 'flex',
            boxSizing: 'border-box',
            ':focus': {
                outline: 'none',
            },
            ':hover': {
                borderColor: theme.intents.primary.primary,
            },
        },
    }, expanded);
}

const createTriggerContentStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    }, expanded);
}

const createTriggerTextStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        fontSize: theme.typography?.fontSize?.md || 16,
        color: theme.colors?.text?.primary || '#000000',
        flex: 1,
    }, expanded);
}

const createPlaceholderStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        fontSize: theme.typography?.fontSize?.md || 16,
        color: theme.colors?.text?.disabled || '#999999',
    }, expanded);
}

const createIconStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        marginLeft: theme.spacing?.xs || 4,
        color: theme.colors?.text?.secondary || '#666666',
    }, expanded);
}

const createChevronStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: theme.spacing?.xs || 4,
        color: theme.colors?.text?.secondary || '#666666',
        width: 20,
        height: 20,
        _web: {
            transition: 'transform 0.2s ease',
        },
    }, expanded);
}

const createChevronOpenStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        transform: 'rotate(180deg)',
    }, expanded);
}

const createDropdownStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: theme.colors?.surface?.primary || '#ffffff',
        borderRadius: theme.borderRadius?.md || 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors?.border?.primary || '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
        zIndex: 9999,
        maxHeight: 240,
        minWidth: 200,
        overflow: 'hidden',
        _web: {
            border: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
            overflowY: 'auto',
        },
    }, expanded);
}

const createSearchContainerStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        padding: theme.spacing?.sm || 8,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors?.border?.primary || '#e0e0e0',
        _web: {
            borderBottom: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
        },
    }, expanded);
}

const createSearchInputStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        padding: theme.spacing?.xs || 4,
        borderRadius: theme.borderRadius?.sm || 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors?.border?.primary || '#e0e0e0',
        fontSize: theme.typography?.fontSize?.sm || 14,
        backgroundColor: theme.colors?.surface?.primary || '#ffffff',
        _web: {
            border: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            outline: 'none',
            ':focus': {
                borderColor: theme.intents.primary.primary,
            },
        },
    }, expanded);
}

const createOptionsListStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        paddingVertical: theme.spacing?.xs || 4,
    }, expanded);
}

const createOptionStyles = (theme: Theme, expanded: Partial<ExpandedSelectOptionStyles>): ExpandedSelectOptionStyles => {
    return deepMerge({
        paddingHorizontal: theme.spacing?.sm || 8,
        paddingVertical: theme.spacing?.xs || 4,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 36,
        variants: {
            selected: {
                true: {
                    backgroundColor: theme.intents.primary.container || theme.intents.primary.primary + '20',
                },
                false: {},
            },
            disabled: {
                true: {
                    opacity: 0.5,
                    _web: {
                        cursor: 'not-allowed',
                        ':hover': {
                            backgroundColor: 'transparent',
                        },
                    },
                },
                false: {},
            },
        },
        _web: {
            cursor: 'pointer',
            display: 'flex',
            ':hover': {
                backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
            },
        },
    }, expanded);
}

const createOptionContentStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    }, expanded);
}

const createOptionIconStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        marginRight: theme.spacing?.xs || 4,
    }, expanded);
}

const createOptionTextStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        fontSize: theme.typography?.fontSize?.md || 16,
        color: theme.colors?.text?.primary || '#000000',
        flex: 1,
    }, expanded);
}

const createOptionTextDisabledStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        color: theme.colors?.text?.disabled || '#999999',
    }, expanded);
}

const createHelperTextStyles = (theme: Theme, expanded: Partial<ExpandedSelectHelperTextStyles>): ExpandedSelectHelperTextStyles => {
    return deepMerge({
        fontSize: theme.typography?.fontSize?.xs || 12,
        marginTop: theme.spacing?.xs || 4,
        color: theme.colors?.text?.secondary || '#666666',
        variants: {
            error: {
                true: {
                    color: theme.intents.error.primary,
                },
                false: {},
            },
        },
    }, expanded);
}

const createOverlayStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        _web: {
            position: 'fixed',
        },
    }, expanded);
}

export const createSelectStylesheet = (theme: Theme, expanded?: Partial<SelectStylesheet>): SelectStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
        trigger: createTriggerStyles(theme, expanded?.trigger || {}),
        triggerContent: createTriggerContentStyles(theme, expanded?.triggerContent || {}),
        triggerText: createTriggerTextStyles(theme, expanded?.triggerText || {}),
        placeholder: createPlaceholderStyles(theme, expanded?.placeholder || {}),
        icon: createIconStyles(theme, expanded?.icon || {}),
        chevron: createChevronStyles(theme, expanded?.chevron || {}),
        chevronOpen: createChevronOpenStyles(theme, expanded?.chevronOpen || {}),
        dropdown: createDropdownStyles(theme, expanded?.dropdown || {}),
        searchContainer: createSearchContainerStyles(theme, expanded?.searchContainer || {}),
        searchInput: createSearchInputStyles(theme, expanded?.searchInput || {}),
        optionsList: createOptionsListStyles(theme, expanded?.optionsList || {}),
        option: createOptionStyles(theme, expanded?.option || {}),
        optionContent: createOptionContentStyles(theme, expanded?.optionContent || {}),
        optionIcon: createOptionIconStyles(theme, expanded?.optionIcon || {}),
        optionText: createOptionTextStyles(theme, expanded?.optionText || {}),
        optionTextDisabled: createOptionTextDisabledStyles(theme, expanded?.optionTextDisabled || {}),
        helperText: createHelperTextStyles(theme, expanded?.helperText || {}),
        overlay: createOverlayStyles(theme, expanded?.overlay || {}),
    };
}
