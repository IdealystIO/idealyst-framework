/**
 * IconButton styles using defineStyle with $iterator expansion.
 *
 * Dynamic style functions are used for intent/type combinations since
 * the color depends on both values (compound logic).
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';
import { IconButtonGradient } from './types';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type IconButtonSize = Size;
type IconButtonType = 'contained' | 'outlined' | 'text';

export type IconButtonVariants = {
    size: IconButtonSize;
    intent: Intent;
    type: IconButtonType;
    disabled: boolean;
    gradient?: IconButtonGradient;
}

/**
 * All dynamic props passed to icon button style functions.
 */
export type IconButtonDynamicProps = {
    intent?: Intent;
    type?: IconButtonType;
    size?: Size;
    disabled?: boolean;
    gradient?: IconButtonGradient;
};

/**
 * IconButton styles with $iterator expansion for size variants.
 * Circular button that only contains an icon.
 */
export const iconButtonStyles = defineStyle('IconButton', (theme: Theme) => ({
    button: ({ intent = 'primary', type = 'contained' }: IconButtonDynamicProps) => ({
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999, // Fully circular
        // Inline theme accesses so Unistyles can trace them
        backgroundColor: type === 'contained'
            ? theme.intents[intent].primary
            : type === 'outlined'
                ? theme.colors.surface.primary
                : 'transparent',
        borderColor: type === 'outlined'
            ? theme.intents[intent].primary
            : 'transparent',
        borderWidth: type === 'outlined' ? 1 : 0,
        borderStyle: type === 'outlined' ? 'solid' as const : undefined,
        _web: {
            display: 'flex',
            transition: 'all 0.1s ease',
        },
        variants: {
            type: {
                contained: {
                    backgroundColor: theme.$intents.primary,
                    borderColor: 'transparent',
                },
                outlined: {
                    backgroundColor: 'transparent',
                    borderColor: theme.$intents.primary,
                },
                text: {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    borderWidth: 0,
                }
            },
            // Size variants - circular so width equals height
            size: {
                width: theme.sizes.$iconButton.size,
                height: theme.sizes.$iconButton.size,
                minWidth: theme.sizes.$iconButton.size,
                minHeight: theme.sizes.$iconButton.size,
            },
            disabled: {
                true: { opacity: 0.6 },
                false: { opacity: 1, _web: { cursor: 'pointer', _hover: { opacity: 0.90 }, _active: { opacity: 0.75 } } },
            },
            gradient: {
                darken: { _web: { backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.15) 100%)' } },
                lighten: { _web: { backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%)' } },
            },
        },
    }),
    icon: ({ intent = 'primary', type = 'contained' }: IconButtonDynamicProps) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: type === 'contained'
            ? theme.intents[intent].contrast
            : theme.intents[intent].primary,
        variants: {
            size: {
                width: theme.sizes.$iconButton.iconSize,
                height: theme.sizes.$iconButton.iconSize,
            },
        },
    }),
    spinner: ({ intent = 'primary', type = 'contained' }: IconButtonDynamicProps) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Match the icon color based on button type
        color: type === 'contained'
            ? theme.intents[intent].contrast
            : theme.intents[intent].primary,
        variants: {
            size: {
                width: theme.sizes.$iconButton.iconSize,
                height: theme.sizes.$iconButton.iconSize,
            },
        },
    }),
}));
