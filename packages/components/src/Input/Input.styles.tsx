import { StyleSheet } from 'react-native-unistyles';
import { Theme, Size } from '@idealyst/theme';
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

type InputDynamicProps = {
    type?: InputType;
    focused?: boolean;
    hasError?: boolean;
    disabled?: boolean;
};

/**
 * Get container border/background styles based on type, focused, hasError, disabled
 */
function getContainerDynamicStyles(theme: Theme, props: InputDynamicProps) {
    const { type = 'outlined', focused = false, hasError = false, disabled = false } = props;
    const focusColor = theme.intents.primary.primary;
    const errorColor = theme.intents.error.primary;

    // Base styles by type
    let backgroundColor = 'transparent';
    let borderWidth = 1;
    let borderColor = theme.colors.border.primary;
    let borderStyle = 'solid' as const;

    if (type === 'filled') {
        backgroundColor = theme.colors.surface.secondary;
        borderWidth = 0;
    } else if (type === 'bare') {
        backgroundColor = 'transparent';
        borderWidth = 0;
    }

    // Error state takes precedence
    if (hasError) {
        borderColor = errorColor;
        borderWidth = 1;
    }

    // Focus state (error still takes precedence for color)
    if (focused && !hasError) {
        borderColor = focusColor;
        borderWidth = 1;
    }

    // Disabled state
    if (disabled) {
        backgroundColor = theme.colors.surface.secondary;
    }

    return {
        backgroundColor,
        borderWidth,
        borderColor,
        borderStyle,
    };
}

/**
 * Create dynamic container styles
 */
function createContainerStyles(theme: Theme) {
    return (props: InputDynamicProps) => {
        const { type = 'outlined', focused = false, hasError = false, disabled = false } = props;
        const dynamicStyles = getContainerDynamicStyles(theme, props);
        const focusColor = theme.intents.primary.primary;
        const errorColor = theme.intents.error.primary;

        // Web-specific border and shadow
        let webBorder = `1px solid ${dynamicStyles.borderColor}`;
        let webBoxShadow = 'none';

        if (type === 'filled' || type === 'bare') {
            webBorder = 'none';
        }

        if (hasError) {
            webBorder = `1px solid ${errorColor}`;
            if (focused) {
                webBoxShadow = `0 0 0 2px ${errorColor}20`;
            }
        } else if (focused) {
            webBorder = `1px solid ${focusColor}`;
            webBoxShadow = `0 0 0 2px ${focusColor}20`;
        }

        return {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            minWidth: 0,
            borderRadius: 8,
            ...dynamicStyles,
            opacity: disabled ? 0.6 : 1,
            variants: {
                size: buildSizeVariants(theme, 'input', (size) => ({
                    height: size.height,
                    paddingHorizontal: size.paddingHorizontal,
                })),
                // Spacing variants from FormInputStyleProps
                margin: buildMarginVariants(theme),
                marginVertical: buildMarginVerticalVariants(theme),
                marginHorizontal: buildMarginHorizontalVariants(theme),
            },
            _web: {
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                border: webBorder,
                boxShadow: webBoxShadow,
                cursor: disabled ? 'not-allowed' : 'text',
            },
        } as const;
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
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
