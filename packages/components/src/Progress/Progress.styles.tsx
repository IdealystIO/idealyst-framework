/**
 * Progress styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type ProgressDynamicProps = {
    size?: Size;
    intent?: Intent;
    rounded?: boolean;
};

/**
 * Progress styles with intent-based coloring.
 */
export const progressStyles = defineStyle('Progress', (theme: Theme) => ({
    container: (_props: ProgressDynamicProps) => ({
        gap: 4 as const,
    }),

    linearTrack: (_props: ProgressDynamicProps) => ({
        backgroundColor: theme.colors.border.secondary,
        overflow: 'hidden' as const,
        position: 'relative' as const,
        variants: {
            // $iterator expands for each progress size
            size: {
                height: theme.sizes.$progress.linearHeight,
            },
            rounded: {
                true: { borderRadius: 9999 },
                false: { borderRadius: 0 },
            },
        },
    }),

    linearBar: ({ intent = 'primary' }: ProgressDynamicProps) => ({
        height: '100%' as const,
        backgroundColor: theme.intents[intent].primary,
        variants: {
            rounded: {
                true: { borderRadius: 9999 },
                false: { borderRadius: 0 },
            },
        },
        _web: {
            transition: 'width 0.3s ease' as const,
        },
    }),

    indeterminateBar: ({ intent = 'primary' }: ProgressDynamicProps) => ({
        position: 'absolute' as const,
        height: '100%' as const,
        width: '40%' as const,
        backgroundColor: theme.intents[intent].primary,
        variants: {
            rounded: {
                true: { borderRadius: 9999 },
                false: { borderRadius: 0 },
            },
        },
    }),

    circularContainer: (_props: ProgressDynamicProps) => ({
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        position: 'relative' as const,
        variants: {
            size: {
                width: theme.sizes.$progress.circularSize,
                height: theme.sizes.$progress.circularSize,
            },
        },
    }),

    circularTrack: (_props: ProgressDynamicProps) => ({
        _web: {
            stroke: theme.colors.border.secondary,
        },
    }),

    circularBar: ({ intent = 'primary' }: ProgressDynamicProps) => ({
        _web: {
            stroke: theme.intents[intent].primary,
        },
    }),

    label: (_props: ProgressDynamicProps) => ({
        color: theme.colors.text.primary,
        textAlign: 'center' as const,
        variants: {
            size: {
                fontSize: theme.sizes.$progress.labelFontSize,
            },
        },
    }),

    circularLabel: (_props: ProgressDynamicProps) => ({
        position: 'absolute' as const,
        fontWeight: '600' as const,
        color: theme.colors.text.primary,
        variants: {
            size: {
                fontSize: theme.sizes.$progress.circularLabelFontSize,
            },
        },
    }),
}));
