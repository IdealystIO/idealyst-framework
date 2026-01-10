/**
 * Alert styles using defineStyle with dynamic intent/type handling.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type AlertType = 'filled' | 'outlined' | 'soft';

export type AlertDynamicProps = {
    intent?: Intent;
    type?: AlertType;
};

/**
 * Alert styles with intent/type combination handling.
 */
export const alertStyles = defineStyle('Alert', (theme: Theme) => ({
    container: ({ intent = 'neutral', type = 'soft' }: AlertDynamicProps) => {
        const intentValue = theme.intents[intent];

        // Background color based on type
        const backgroundColor = type === 'filled'
            ? intentValue.primary
            : type === 'soft'
                ? intentValue.light
                : 'transparent';

        // Border color based on type
        const borderColor = (type === 'filled' || type === 'outlined')
            ? intentValue.primary
            : intentValue.light;

        return {
            display: 'flex' as const,
            flexDirection: 'row' as const,
            alignItems: 'flex-start' as const,
            gap: 8,
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: 'solid' as const,
            backgroundColor,
            borderColor,
        } as const;
    },

    iconContainer: ({ intent = 'neutral', type = 'soft' }: AlertDynamicProps) => {
        const intentValue = theme.intents[intent];
        const color = type === 'filled' ? intentValue.contrast : intentValue.primary;

        return {
            display: 'flex' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            alignSelf: 'flex-start' as const,
            flexShrink: 0,
            width: 24,
            height: 24,
            marginTop: 2,
            color,
        } as const;
    },

    title: ({ intent = 'neutral', type = 'soft' }: AlertDynamicProps) => {
        const intentValue = theme.intents[intent];
        const color = type === 'filled' ? intentValue.contrast : intentValue.primary;

        return {
            fontSize: 16,
            lineHeight: 24,
            fontWeight: '600' as const,
            color,
        } as const;
    },

    message: ({ intent = 'neutral', type = 'soft' }: AlertDynamicProps) => {
        const intentValue = theme.intents[intent];
        const color = type === 'filled' ? intentValue.contrast : theme.colors.text.primary;

        return {
            fontSize: 14,
            lineHeight: 20,
            color,
        } as const;
    },

    content: (_props: AlertDynamicProps) => ({
        flex: 1,
        display: 'flex' as const,
        flexDirection: 'column' as const,
        gap: 4,
    }),

    actions: (_props: AlertDynamicProps) => ({
        marginTop: 4,
        display: 'flex' as const,
        flexDirection: 'row' as const,
        gap: 8,
    }),

    closeButton: (_props: AlertDynamicProps) => ({
        padding: 4,
        borderRadius: 4,
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        flexShrink: 0,
        alignSelf: 'flex-start' as const,
        marginTop: 2,
        _web: {
            appearance: 'none',
            background: 'none',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            margin: 0,
            _hover: {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
        },
    }),

    closeIcon: ({ intent = 'neutral', type = 'soft' }: AlertDynamicProps) => {
        const intentValue = theme.intents[intent];
        const color = type === 'filled' ? intentValue.contrast : intentValue.primary;

        return {
            display: 'flex' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            width: 16,
            height: 16,
            color,
        } as const;
    },
}));
