/**
 * Card styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Radius, Surface } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type CardType = 'outlined' | 'elevated' | 'filled';
type CardIntent = Intent | 'info' | 'neutral';
type CardPadding = ViewStyleSize | 'none';

export type CardVariants = {
    type: CardType;
    radius: Radius;
    intent: CardIntent;
    pressable: boolean;
    disabled: boolean;
    background: Surface;
    gap: CardPadding;
    padding: CardPadding;
    paddingVertical: CardPadding;
    paddingHorizontal: CardPadding;
    margin: CardPadding;
    marginVertical: CardPadding;
    marginHorizontal: CardPadding;
};

export type CardDynamicProps = {
    intent?: CardIntent;
    type?: CardType;
};

/**
 * Card styles with dynamic type/intent handling.
 *
 * NOTE: Top-level theme access required for Unistyles reactivity.
 */
export const cardStyles = defineStyle('Card', (theme: Theme) => ({
    card: (_props: CardDynamicProps) => ({
        position: 'relative' as const,
        overflow: 'hidden' as const,
        // Theme marker for Unistyles reactivity
        backgroundColor: theme.colors.surface.primary,
        borderColor: theme.colors.border.secondary,
        variants: {
            type: {
                outlined: {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderStyle: 'solid' as const,
                },
                elevated: {
                    backgroundColor: theme.colors.surface.primary,
                    borderWidth: 0,
                    ...theme.shadows.md,
                },
                filled: {
                    backgroundColor: theme.colors.surface.secondary,
                    borderWidth: 0,
                },
            },
            radius: {
                none: { borderRadius: 0 },
                xs: { borderRadius: 2 },
                sm: { borderRadius: 4 },
                md: { borderRadius: 8 },
                lg: { borderRadius: 12 },
                xl: { borderRadius: 16 },
            },
            // $iterator expands for each surface color
            background: {
                backgroundColor: theme.colors.$surface,
            },
            pressable: {
                true: {
                    _web: {
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s ease',
                        _hover: {
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06)',
                        },
                    },
                },
                false: {
                    _web: { cursor: 'default' },
                },
            },
            disabled: {
                true: { opacity: 0.6, _web: { cursor: 'not-allowed' } },
                false: { opacity: 1 },
            },
            // $iterator expands for each view size, plus 'none'
            gap: {
                none: { gap: 0 },
                xs: { gap: theme.sizes.view.xs.spacing },
                sm: { gap: theme.sizes.view.sm.spacing },
                md: { gap: theme.sizes.view.md.spacing },
                lg: { gap: theme.sizes.view.lg.spacing },
                xl: { gap: theme.sizes.view.xl.spacing },
            },
            padding: {
                none: { padding: 0 },
                xs: { padding: theme.sizes.view.xs.padding },
                sm: { padding: theme.sizes.view.sm.padding },
                md: { padding: theme.sizes.view.md.padding },
                lg: { padding: theme.sizes.view.lg.padding },
                xl: { padding: theme.sizes.view.xl.padding },
            },
            paddingVertical: {
                none: { paddingVertical: 0 },
                xs: { paddingVertical: theme.sizes.view.xs.padding },
                sm: { paddingVertical: theme.sizes.view.sm.padding },
                md: { paddingVertical: theme.sizes.view.md.padding },
                lg: { paddingVertical: theme.sizes.view.lg.padding },
                xl: { paddingVertical: theme.sizes.view.xl.padding },
            },
            paddingHorizontal: {
                none: { paddingHorizontal: 0 },
                xs: { paddingHorizontal: theme.sizes.view.xs.padding },
                sm: { paddingHorizontal: theme.sizes.view.sm.padding },
                md: { paddingHorizontal: theme.sizes.view.md.padding },
                lg: { paddingHorizontal: theme.sizes.view.lg.padding },
                xl: { paddingHorizontal: theme.sizes.view.xl.padding },
            },
            margin: {
                none: { margin: 0 },
                xs: { margin: theme.sizes.view.xs.padding },
                sm: { margin: theme.sizes.view.sm.padding },
                md: { margin: theme.sizes.view.md.padding },
                lg: { margin: theme.sizes.view.lg.padding },
                xl: { margin: theme.sizes.view.xl.padding },
            },
            marginVertical: {
                none: { marginVertical: 0 },
                xs: { marginVertical: theme.sizes.view.xs.padding },
                sm: { marginVertical: theme.sizes.view.sm.padding },
                md: { marginVertical: theme.sizes.view.md.padding },
                lg: { marginVertical: theme.sizes.view.lg.padding },
                xl: { marginVertical: theme.sizes.view.xl.padding },
            },
            marginHorizontal: {
                none: { marginHorizontal: 0 },
                xs: { marginHorizontal: theme.sizes.view.xs.padding },
                sm: { marginHorizontal: theme.sizes.view.sm.padding },
                md: { marginHorizontal: theme.sizes.view.md.padding },
                lg: { marginHorizontal: theme.sizes.view.lg.padding },
                xl: { marginHorizontal: theme.sizes.view.xl.padding },
            },
        },
        _web: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
    }),
}));
