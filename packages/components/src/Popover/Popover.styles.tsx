/**
 * Popover styles using defineStyle.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type PopoverPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

export type PopoverDynamicProps = {
    placement?: PopoverPlacement;
};

/**
 * Popover styles with placement variants.
 */
export const popoverStyles = defineStyle('Popover', (theme: Theme) => ({
    container: (_props: PopoverDynamicProps) => ({
        backgroundColor: theme.colors.surface.primary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
        borderStyle: 'solid' as const,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        _web: {
            border: `1px solid ${theme.colors.border.primary}`,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'opacity 150ms ease-out, transform 150ms ease-out',
            transformOrigin: 'center center',
        },
    }),

    content: (_props: PopoverDynamicProps) => ({
        padding: 16,
    }),

    arrow: (_props: PopoverDynamicProps) => ({
        position: 'absolute' as const,
        width: 12,
        height: 12,
        backgroundColor: theme.colors.surface.primary,
        variants: {
            placement: {
                top: { bottom: -6, _web: { left: '50%', marginLeft: -6 } },
                'top-start': { bottom: -6, left: 16 },
                'top-end': { bottom: -6, right: 16 },
                bottom: { top: -6, _web: { left: '50%', marginLeft: -6 } },
                'bottom-start': { top: -6, left: 16 },
                'bottom-end': { top: -6, right: 16 },
                left: { right: -6, _web: { top: '50%', marginTop: -6 } },
                'left-start': { right: -6, top: 16 },
                'left-end': { right: -6, bottom: 16 },
                right: { left: -6, _web: { top: '50%', marginTop: -6 } },
                'right-start': { left: -6, top: 16 },
                'right-end': { left: -6, bottom: 16 },
            },
        },
        _web: {
            transform: 'rotate(45deg)',
            boxShadow: '-2px 2px 4px rgba(0, 0, 0, 0.1)',
        },
    }),

    backdrop: (_props: PopoverDynamicProps) => ({
        flex: 1,
        backgroundColor: 'transparent' as const,
    }),
}));
