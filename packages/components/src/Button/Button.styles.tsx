import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent, Size } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import { ButtonGradient } from './types';

type ButtonSize = Size;
type ButtonType = 'contained' | 'outlined' | 'text';

export type ButtonVariants = {
    size: ButtonSize;
    intent: Intent;
    type: ButtonType;
    disabled: boolean;
    gradient?: ButtonGradient;
}

type ButtonDynamicProps = {
    intent?: Intent;
    type?: ButtonType;
};

/**
 * Get button background color based on intent and type
 */
function getButtonBackgroundColor(theme: Theme, intent: Intent, type: ButtonType): string {
    if (type === 'contained') {
        return theme.intents[intent].primary;
    }
    if (type === 'outlined') {
        return theme.colors.surface.primary;
    }
    return 'transparent';
}

/**
 * Get button border color based on intent and type
 */
function getButtonBorderColor(theme: Theme, intent: Intent, type: ButtonType): string {
    if (type === 'outlined') {
        return theme.intents[intent].primary;
    }
    return 'transparent';
}

/**
 * Get text/icon color based on intent and type
 */
function getTextColor(theme: Theme, intent: Intent, type: ButtonType): string {
    if (type === 'contained') {
        return theme.intents[intent].contrast;
    }
    return theme.intents[intent].primary;
}

/**
 * Create dynamic button styles
 */
function createButtonStyles(theme: Theme) {
    return ({ intent = 'primary', type = 'contained' }: ButtonDynamicProps) => {
        return {
            boxSizing: 'border-box',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            fontWeight: '600',
            textAlign: 'center',
            backgroundColor: getButtonBackgroundColor(theme, intent, type),
            borderColor: getButtonBorderColor(theme, intent, type),
            borderWidth: type === 'outlined' ? 1 : 0,
            borderStyle: type === 'outlined' ? 'solid' as const : undefined,
            _web: {
                display: 'flex',
                transition: 'all 0.1s ease',
            },
            variants: {
                size: buildSizeVariants(theme, 'button', size => ({
                    paddingVertical: size.paddingVertical,
                    paddingHorizontal: size.paddingHorizontal,
                    minHeight: size.minHeight,
                })),
                disabled: {
                    true: { opacity: 0.6 },
                    false: { opacity: 1, _web: { cursor: 'pointer', _hover: { opacity: 0.90 }, _active: { opacity: 0.75 } } },
                },
                gradient: {
                    darken: { _web: { backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.15) 100%)' } },
                    lighten: { _web: { backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%)' } },
                },
            },
        } as const;
    };
}

/**
 * Create dynamic text styles
 */
function createTextStyles(theme: Theme) {
    return ({ intent = 'primary', type = 'contained' }: ButtonDynamicProps) => {
        return {
            fontWeight: '600',
            textAlign: 'center',
            color: getTextColor(theme, intent, type),
            variants: {
                size: buildSizeVariants(theme, 'button', size => ({
                    fontSize: size.fontSize,
                })),
                disabled: {
                    true: { opacity: 0.6 },
                    false: { opacity: 1 },
                },
            },
        } as const;
    };
}

/**
 * Create dynamic icon styles
 */
function createIconStyles(theme: Theme) {
    return ({ intent = 'primary', type = 'contained' }: ButtonDynamicProps) => {
        return {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getTextColor(theme, intent, type),
            variants: {
                size: buildSizeVariants(theme, 'button', size => ({
                    width: size.iconSize,
                    height: size.iconSize,
                })),
            },
        } as const;
    };
}

// Styles use dynamic functions for intent/type to support theme extensions
export const buttonStyles = StyleSheet.create((theme: Theme) => {
    return {
        button: createButtonStyles(theme),
        text: createTextStyles(theme),
        icon: createIconStyles(theme),
        iconContainer: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
        },
    };
});
