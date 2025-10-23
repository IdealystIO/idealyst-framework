import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Size } from "../theme/size";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

type InputSize = Size;
type InputType = 'default' | 'outlined' | 'filled' | 'bare';

type InputVariants = {
    size: InputSize;
    type: InputType;
    focused: boolean;
    hasError: boolean;
    disabled: boolean;
}

export type ExpandedInputStyles = StylesheetStyles<keyof InputVariants>;

export type InputStylesheet = {
    container: ExpandedInputStyles;
    leftIconContainer: ExpandedInputStyles;
    rightIconContainer: ExpandedInputStyles;
    leftIcon: ExpandedInputStyles;
    rightIcon: ExpandedInputStyles;
    passwordToggle: ExpandedInputStyles;
    passwordToggleIcon: ExpandedInputStyles;
    input: ExpandedInputStyles;
}

/**
 * Create size variants for container
 */
function createContainerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'input', (size) => ({
        height: size.height,
        paddingHorizontal: size.paddingHorizontal,
    }));
}

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        default: {
            backgroundColor: theme.colors.surface.primary,
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            borderStyle: 'solid',
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
        outlined: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            borderStyle: 'solid',
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
        filled: {
            backgroundColor: theme.colors.surface.secondary,
            borderWidth: 0,
            _web: {
                border: 'none',
            },
        },
        bare: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            _web: {
                border: 'none',
            },
        },
    };
}

/**
 * Create focused state variants dynamically based on type and hasError
 */
function createFocusedVariants(theme: Theme, type: InputType, hasError: boolean) {
    if (hasError) {
        return {
            true: {
                borderColor: theme.intents.error.primary,
                _web: {
                    border: `1px solid ${theme.intents.error.primary}`,
                    boxShadow: `0 0 0 2px ${theme.intents.error.primary}20`,
                },
            },
            false: {},
        };
    }

    const focusColor = theme.intents.primary.primary;

    switch (type) {
        case 'default':
            return {
                true: {
                    borderColor: focusColor,
                    _web: {
                        border: `1px solid ${focusColor}`,
                        boxShadow: `0 0 0 2px ${focusColor}20`,
                    },
                },
                false: {},
            };
        case 'outlined':
            return {
                true: {
                    borderColor: focusColor,
                    _web: {
                        border: `2px solid ${focusColor}`,
                    },
                },
                false: {},
            };
        case 'filled':
            return {
                true: {
                    _web: {
                        boxShadow: `0 0 0 2px ${focusColor}20`,
                    },
                },
                false: {},
            };
        case 'bare':
            return {
                true: {},
                false: {},
            };
    }
}

/**
 * Create size variants for icon containers
 */
function createIconContainerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'input', (size) => ({
        marginRight: size.iconMargin,
    }));
}

/**
 * Create size variants for icons
 */
function createIconSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'input', (size) => ({
        fontSize: size.iconSize,
        width: size.iconSize,
        height: size.iconSize,
    }));
}

/**
 * Create size variants for input
 */
function createInputSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'input', (size) => ({
        fontSize: size.fontSize,
    }));
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>) => {
    return ({ type, hasError }: InputVariants) => {
        return deepMerge({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            borderRadius: 8,
            variants: {
                size: createContainerSizeVariants(theme),
                type: createContainerTypeVariants(theme),
                focused: createFocusedVariants(theme, type, hasError),
                hasError: {
                    true: {
                        borderColor: theme.intents.error.primary,
                        _web: {
                            border: `1px solid ${theme.intents.error.primary}`,
                        },
                    },
                    false: {},
                },
                disabled: {
                    true: {
                        opacity: 0.6,
                        backgroundColor: theme.colors.surface.secondary,
                        _web: {
                            cursor: 'not-allowed',
                        },
                    },
                    false: {
                        _web: {
                            cursor: 'text',
                            _hover: {
                                borderColor: theme.intents.primary.primary,
                            },
                        },
                    },
                },
            },
            _web: {
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            },
        }, expanded);
    }
}

const createLeftIconContainerStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>) => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        variants: {
            size: createIconContainerSizeVariants(theme),
        },
    }, expanded);
}

const createRightIconContainerStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>) => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        variants: {
            size: buildSizeVariants(theme, 'input', (size) => ({
                marginLeft: size.iconMargin,
            })),
        },
    }, expanded);
}

const createLeftIconStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>) => {
    return deepMerge({
        color: theme.colors.text.secondary,
        variants: {
            size: createIconSizeVariants(theme),
        },
    }, expanded);
}

const createRightIconStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>) => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: theme.colors.text.secondary,
        variants: {
            size: createIconSizeVariants(theme),
        },
    }, expanded);
}

const createPasswordToggleStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>) => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
        variants: {
            size: buildSizeVariants(theme, 'input', (size) => ({
                marginLeft: size.iconMargin,
            })),
        },
        _web: {
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            _hover: {
                opacity: 0.7,
            },
            _active: {
                opacity: 0.5,
            },
        },
    }, expanded);
}

const createPasswordToggleIconStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>) => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: theme.colors.text.secondary,
        variants: {
            size: createIconSizeVariants(theme),
        },
    }, expanded);
}

const createInputStyles = (theme: Theme, expanded: Partial<ExpandedInputStyles>) => {
    return deepMerge({
        flex: 1,
        minWidth: 0,
        backgroundColor: 'transparent',
        color: theme.colors.text.primary,
        fontWeight: '400',
        variants: {
            size: createInputSizeVariants(theme),
        },
        _web: {
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
        },
    }, expanded);
}

export const createInputStylesheet = (theme: Theme, expanded?: Partial<InputStylesheet>): InputStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        leftIconContainer: createLeftIconContainerStyles(theme, expanded?.leftIconContainer || {}),
        rightIconContainer: createRightIconContainerStyles(theme, expanded?.rightIconContainer || {}),
        leftIcon: createLeftIconStyles(theme, expanded?.leftIcon || {}),
        rightIcon: createRightIconStyles(theme, expanded?.rightIcon || {}),
        passwordToggle: createPasswordToggleStyles(theme, expanded?.passwordToggle || {}),
        passwordToggleIcon: createPasswordToggleIconStyles(theme, expanded?.passwordToggleIcon || {}),
        input: createInputStyles(theme, expanded?.input || {}),
    };
}
