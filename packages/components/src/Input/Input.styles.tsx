import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Size} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';

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


function createContainerStyles(theme: Theme) {
    return ({ type, hasError }: InputVariants) => {
        return {
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
        };
    }
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const inputStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: createContainerStyles(theme),
    leftIconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        variants: {
            size: buildSizeVariants(theme, 'input', (size) => ({
                marginRight: size.iconMargin,
            })),
        },
    },
    rightIconContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        variants: {
            size: buildSizeVariants(theme, 'input', (size) => ({
                marginLeft: size.iconMargin,
            })),
        },
    },
    leftIcon: {
        color: theme.colors.text.secondary,
        variants: {
            size: buildSizeVariants(theme, 'input', (size) => ({
                fontSize: size.iconSize,
                width: size.iconSize,
                height: size.iconSize,
            })),
        },
    },
    rightIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: theme.colors.text.secondary,
        variants: {
            size: buildSizeVariants(theme, 'input', (size) => ({
            fontSize: size.iconSize,
            width: size.iconSize,
            height: size.iconSize,
        })),
        },
    },
    passwordToggle: {
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
    },
    passwordToggleIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: theme.colors.text.secondary,
        variants: {
            size: buildSizeVariants(theme, 'input', (size) => ({
                fontSize: size.iconSize,
                width: size.iconSize,
                height: size.iconSize,
            })),
        },
    },
    input: {
        flex: 1,
        minWidth: 0,
        backgroundColor: 'transparent',
        color: theme.colors.text.primary,
        fontWeight: '400',
        variants: {
            size: buildSizeVariants(theme, 'input', (size) => ({
                fontSize: size.fontSize,
            })),
        },
        _web: {
            border: 'none',
            outline: 'none',
            fontFamily: 'inherit',
        },
    },
  };
});