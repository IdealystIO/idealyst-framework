/**
 * Tooltip styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type TooltipDynamicProps = {
    size?: Size;
    intent?: Intent;
};

/**
 * Tooltip styles with size and intent variants.
 */
export const tooltipStyles = defineStyle('Tooltip', (theme: Theme) => ({
    container: (_props: TooltipDynamicProps) => ({
        position: 'relative' as const,
        _web: {
            display: 'inline-flex',
            width: 'fit-content',
        },
    }),

    tooltip: (_props: TooltipDynamicProps) => ({
        borderRadius: 8,
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
        variants: {
            // $iterator expands for each tooltip size
            size: {
                fontSize: theme.sizes.$tooltip.fontSize,
                padding: theme.sizes.$tooltip.padding,
            },
            // $iterator expands for each intent
            intent: {
                backgroundColor: theme.$intents.primary,
                color: theme.$intents.contrast,
            },
        },
        _web: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            pointerEvents: 'none',
            width: 'max-content',
            wordWrap: 'break-word',
        },
    }),
}));
