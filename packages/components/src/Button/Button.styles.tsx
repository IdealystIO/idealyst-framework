/**
 * Button styles using defineStyle with $iterator expansion.
 *
 * Dynamic style functions are used for intent/type combinations since
 * the color depends on both values (compound logic).
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';
import { ButtonGradient } from './types';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type ButtonSize = Size;
type ButtonType = 'contained' | 'outlined' | 'text';

export type ButtonVariants = {
    size: ButtonSize;
    intent: Intent;
    type: ButtonType;
    disabled: boolean;
    gradient?: ButtonGradient;
}

/**
 * All dynamic props passed to button style functions.
 */
export type ButtonDynamicProps = {
    intent?: Intent;
    type?: ButtonType;
    size?: Size;
    disabled?: boolean;
    gradient?: ButtonGradient;
};

/**
 * Button styles with $iterator expansion for size variants.
 *
 * Intent/type combinations use dynamic functions with inlined theme accesses
 * so Unistyles can trace all possible theme paths.
 */
export const buttonStyles = defineStyle('Button', (theme: Theme) => ({
    button: ({ intent = 'primary', type = 'contained' }: ButtonDynamicProps) => ({
        boxSizing: 'border-box',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        fontWeight: '600',
        textAlign: 'center',
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
            // $iterator expands for each button size
            size: {
                paddingVertical: theme.sizes.$button.paddingVertical,
                paddingHorizontal: theme.sizes.$button.paddingHorizontal,
                minHeight: theme.sizes.$button.minHeight,
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
    text: ({ intent = 'primary', type = 'contained' }: ButtonDynamicProps) => ({
        fontWeight: '600',
        textAlign: 'center',
        // Inline: contained uses contrast, others use primary
        color: type === 'contained'
            ? theme.intents[intent].contrast
            : theme.intents[intent].primary,
        variants: {
            size: {
                fontSize: theme.sizes.$button.fontSize,
                lineHeight: theme.sizes.$button.fontSize,
            },
            disabled: {
                true: { opacity: 0.6 },
                false: { opacity: 1 },
            },
        },
    }),
    icon: ({ intent = 'primary', type = 'contained' }: ButtonDynamicProps) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: type === 'contained'
            ? theme.intents[intent].contrast
            : theme.intents[intent].primary,
        variants: {
            size: {
                width: theme.sizes.$button.iconSize,
                height: theme.sizes.$button.iconSize,
            },
        },
    }),
    iconContainer: (_props: ButtonDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: 4,
    }),
}));
