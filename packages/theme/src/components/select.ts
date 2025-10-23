import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { Size } from "../theme/size";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

type SelectSize = Size;
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
            backgroundColor: theme.colors.surface.primary,
            borderColor: theme.colors.border.primary,
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
        filled: {
            backgroundColor: theme.colors.surface.secondary,
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
    return buildSizeVariants(theme, 'select', (size) => ({
        paddingHorizontal: size.paddingHorizontal,
        minHeight: size.minHeight,
    }));
}

/**
 * Create intent variants dynamically based on type
 */
function createIntentVariants(theme: Theme, type: SelectType, intent: SelectIntent) {
    if (intent === 'neutral') {
        return {};
    }

    const intentValue = theme.intents[intent];

    if (type === 'outlined') {
        return {
            borderColor: intentValue.primary,
            _web: {
                border: `1px solid ${intentValue.primary}`,
            },
        };
    }

    return {};
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        position: 'relative',
        backgroundColor: theme.colors.surface.primary,
    }, expanded);
}

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text.primary,
        marginBottom: 4,
    }, expanded);
}

const createTriggerStyles = (theme: Theme, expanded: Partial<ExpandedSelectTriggerStyles>) => {
    return ({ type, intent }: SelectTriggerVariants) => {
        const intentStyles = createIntentVariants(theme, type, intent);

        return deepMerge({
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: 'solid',
            ...intentStyles,
            variants: {
                type: createTriggerTypeVariants(theme),
                size: createTriggerSizeVariants(theme),
                disabled: {
                    true: {
                        opacity: 0.6,
                        _web: {
                            cursor: 'not-allowed',
                        },
                    },
                    false: {
                        _web: {
                            cursor: 'pointer',
                            _hover: {
                                opacity: 0.9,
                            },
                            _active: {
                                opacity: 0.8,
                            },
                        },
                    },
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
            _web: {
                display: 'flex',
                boxSizing: 'border-box',
                _focus: {
                    outline: 'none',
                },
            },
        }, expanded);
    }
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
        color: theme.colors.text.primary,
        flex: 1,
        variants: {
            size: buildSizeVariants(theme, 'select', (size) => ({
                fontSize: size.fontSize,
            })),
        },
    }, expanded);
}

const createPlaceholderStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        color: theme.colors.text.secondary,
        variants: {
            size: buildSizeVariants(theme, 'select', (size) => ({
                fontSize: size.fontSize,
            })),
        },
    }, expanded);
}

const createIconStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        marginLeft: 4,
        color: theme.colors.text.secondary,
    }, expanded);
}

const createChevronStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        color: theme.colors.text.secondary,
        variants: {
            size: buildSizeVariants(theme, 'select', (size) => ({
                width: size.iconSize,
                height: size.iconSize,
            })),
        },
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
        backgroundColor: theme.colors.surface.primary,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.border.primary,
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
            border: `1px solid ${theme.colors.border.primary}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
            overflowY: 'auto',
        },
    }, expanded);
}

const createSearchContainerStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        padding: 8,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors.border.primary,
        _web: {
            borderBottom: `1px solid ${theme.colors.border.primary}`,
        },
    }, expanded);
}

const createSearchInputStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        padding: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.border.primary,
        backgroundColor: theme.colors.surface.primary,
        variants: {
            size: buildSizeVariants(theme, 'select', (size) => ({
                fontSize: size.fontSize,
            })),
        },
        _web: {
            border: `1px solid ${theme.colors.border.primary}`,
            outline: 'none',
            _focus: {
                borderColor: theme.intents.primary.primary,
            },
        },
    }, expanded);
}

const createOptionsListStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        paddingVertical: 4,
    }, expanded);
}

const createOptionStyles = (theme: Theme, expanded: Partial<ExpandedSelectOptionStyles>): ExpandedSelectOptionStyles => {
    return deepMerge({
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 36,
        variants: {
            selected: {
                true: {
                    backgroundColor: theme.intents.primary.light,
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
                        cursor: 'pointer',
                        _hover: {
                            backgroundColor: theme.colors.surface.secondary,
                        },
                        _active: {
                            opacity: 0.8,
                        },
                    },
                },
            },
        },
        _web: {
            display: 'flex',
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
        marginRight: 4,
    }, expanded);
}

const createOptionTextStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        color: theme.colors.text.primary,
        flex: 1,
        variants: {
            size: buildSizeVariants(theme, 'select', (size) => ({
                fontSize: size.fontSize,
            })),
        },
    }, expanded);
}

const createOptionTextDisabledStyles = (theme: Theme, expanded: Partial<ExpandedSelectStyles>): ExpandedSelectStyles => {
    return deepMerge({
        color: theme.colors.text.secondary,
    }, expanded);
}

const createHelperTextStyles = (theme: Theme, expanded: Partial<ExpandedSelectHelperTextStyles>): ExpandedSelectHelperTextStyles => {
    return deepMerge({
        fontSize: 12,
        marginTop: 4,
        color: theme.colors.text.secondary,
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
