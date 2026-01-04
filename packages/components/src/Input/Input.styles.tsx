import { StyleSheet } from 'react-native-unistyles';
import { Theme, Size, CompoundVariants} from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import {
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { InputSize, InputType } from './types';


export type InputVariants = {
    size: InputSize;
    type: InputType;
    focused: boolean;
    hasError: boolean;
    disabled: boolean;
}

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        outlined: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.border.primary,
            borderStyle: 'solid' as const,
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
    } as const;
}

/**
 * Create compound variants for focused + type + hasError combinations
 */
function createFocusedCompoundVariants(theme: Theme) {
    const compoundVariants = [] as CompoundVariants<keyof InputVariants>;
    const focusColor = theme.intents.primary.primary;
    const errorColor = theme.intents.error.primary;

    // Error state takes precedence
    compoundVariants.push({
        focused: true,
        hasError: true,
        styles: {
            borderColor: errorColor,
            _web: {
                border: `1px solid ${errorColor}`,
                boxShadow: `0 0 0 2px ${errorColor}20`,
            },
        },
    });

    // Default type + focused (no error)
    compoundVariants.push({
        type: 'default',
        focused: true,
        hasError: false,
        styles: {
            borderColor: focusColor,
            _web: {
                border: `1px solid ${focusColor}`,
                boxShadow: `0 0 0 2px ${focusColor}20`,
            },
        },
    });

    // Outlined type + focused (no error)
    compoundVariants.push({
        type: 'outlined',
        focused: true,
        hasError: false,
        styles: {
            borderColor: focusColor,
            _web: {
                border: `1px solid ${focusColor}`,
                boxShadow: `0 0 0 2px ${focusColor}20`,
            },
        },
    });

    // Filled type + focused (no error)
    compoundVariants.push({
        type: 'filled',
        focused: true,
        hasError: false,
        styles: {
            _web: {
                boxShadow: `0 0 0 2px ${focusColor}20`,
            },
        },
    });

    return compoundVariants;
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const inputStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        minWidth: 0,
        borderRadius: 8,
        variants: {
            size: buildSizeVariants(theme, 'input', (size) => ({
                height: size.height,
                paddingHorizontal: size.paddingHorizontal,
            })),
            type: createContainerTypeVariants(theme),
            focused: {
                true: {},
                false: {},
            },
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
            // Spacing variants from FormInputStyleProps
            margin: buildMarginVariants(theme),
            marginVertical: buildMarginVerticalVariants(theme),
            marginHorizontal: buildMarginHorizontalVariants(theme),
        },
        compoundVariants: createFocusedCompoundVariants(theme),
        _web: {
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        },
    },
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