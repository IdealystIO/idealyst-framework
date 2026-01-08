/**
 * Card styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Radius } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type CardType = 'outlined' | 'elevated' | 'filled';
type CardIntent = Intent | 'info' | 'neutral';

export type CardVariants = {
    type: CardType;
    radius: Radius;
    intent: CardIntent;
    clickable: boolean;
    disabled: boolean;
    gap: ViewStyleSize;
    padding: ViewStyleSize;
    paddingVertical: ViewStyleSize;
    paddingHorizontal: ViewStyleSize;
    margin: ViewStyleSize;
    marginVertical: ViewStyleSize;
    marginHorizontal: ViewStyleSize;
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
                clickable: {
                    true: {
                        _web: {
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            _hover: {
                                transform: 'translateY(-2px)',
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
                // $iterator expands for each view size
                gap: {
                    gap: theme.sizes.$view.spacing,
                },
                padding: {
                    padding: theme.sizes.$view.padding,
                },
                paddingVertical: {
                    paddingVertical: theme.sizes.$view.padding,
                },
                paddingHorizontal: {
                    paddingHorizontal: theme.sizes.$view.padding,
                },
                margin: {
                    margin: theme.sizes.$view.padding,
                },
                marginVertical: {
                    marginVertical: theme.sizes.$view.padding,
                },
                marginHorizontal: {
                    marginHorizontal: theme.sizes.$view.padding,
                },
            },
            _web: {
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
            },
    }),
}));
