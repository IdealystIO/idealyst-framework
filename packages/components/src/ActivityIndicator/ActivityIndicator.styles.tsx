/**
 * ActivityIndicator styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type ActivityIndicatorDynamicProps = {
    size?: Size;
    intent?: Intent;
    animating?: boolean;
};

/**
 * ActivityIndicator styles with size and intent handling.
 */
export const activityIndicatorStyles = defineStyle('ActivityIndicator', (theme: Theme) => ({
    container: (_props: ActivityIndicatorDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        variants: {
            size: {
                width: theme.sizes.$activityIndicator.size,
                height: theme.sizes.$activityIndicator.size,
            },
            animating: {
                true: { opacity: 1 },
                false: { opacity: 0 },
            },
        },
    }),

    spinner: (_props: ActivityIndicatorDynamicProps) => ({
        borderRadius: 9999,
        borderStyle: 'solid' as const,
        variants: {
            size: {
                width: theme.sizes.$activityIndicator.size,
                height: theme.sizes.$activityIndicator.size,
                borderWidth: theme.sizes.$activityIndicator.borderWidth,
            },
            intent: {
                color: theme.$intents.primary,
                _web: {
                    borderColor: 'transparent',
                    borderTopColor: theme.$intents.primary,
                    borderRightColor: theme.$intents.primary,
                },
            },
        },
        _web: {
            animation: 'spin 1s linear infinite',
            boxSizing: 'border-box',
        },
    }),
}));
