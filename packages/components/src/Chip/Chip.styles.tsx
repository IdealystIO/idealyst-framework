/**
 * Chip styles using defineStyle with variant expansion.
 *
 * Chip has compound logic between type+selected+intent that's handled via
 * nested variants. The $intents iterator expands for all intent values.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type ChipType = 'filled' | 'outlined' | 'soft';

export type ChipDynamicProps = {
    size?: Size;
    intent?: Intent;
    type?: ChipType;
    selected?: boolean;
    disabled?: boolean;
};

/**
 * Chip styles with variant expansion for size/intent/type/selected.
 */
export const chipStyles = defineStyle('Chip', (theme: Theme) => ({
    container: (_props: ChipDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: 4,
        borderStyle: 'solid' as const,
        variants: {
            size: {
                paddingHorizontal: theme.sizes.$chip.paddingHorizontal,
                paddingVertical: theme.sizes.$chip.paddingVertical,
                minHeight: theme.sizes.$chip.minHeight,
                borderRadius: theme.sizes.$chip.borderRadius,
            },
            type: {
                filled: {
                    borderWidth: 1,
                    backgroundColor: theme.$intents.primary,
                    borderColor: 'transparent',
                },
                outlined: {
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                    borderColor: theme.$intents.primary,
                },
                soft: {
                    borderWidth: 0,
                    backgroundColor: theme.$intents.light,
                    borderColor: 'transparent',
                },
            },
            selected: {
                true: {},
                false: {},
            },
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
        compoundVariants: [
            // filled + selected: swap bg/border
            { type: 'filled', selected: true, styles: { backgroundColor: theme.$intents.contrast, borderColor: theme.$intents.primary } },
            // outlined + selected: fill with primary
            { type: 'outlined', selected: true, styles: { backgroundColor: theme.$intents.primary } },
            // soft + selected: fill with primary
            { type: 'soft', selected: true, styles: { backgroundColor: theme.$intents.primary } },
        ],
    }),

    label: (_props: ChipDynamicProps) => ({
        fontFamily: 'inherit' as const,
        fontWeight: '500' as const,
        variants: {
            size: {
                fontSize: theme.sizes.$chip.fontSize,
                lineHeight: theme.sizes.$chip.lineHeight,
            },
            type: {
                filled: { color: theme.$intents.contrast },
                outlined: { color: theme.$intents.primary },
                soft: { color: theme.$intents.dark },
            },
            selected: {
                true: {},
                false: {},
            },
        },
        compoundVariants: [
            { type: 'filled', selected: true, styles: { color: theme.$intents.primary } },
            { type: 'outlined', selected: true, styles: { color: theme.colors.text.inverse } },
            { type: 'soft', selected: true, styles: { color: theme.colors.text.inverse } },
        ],
    }),

    icon: (_props: ChipDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        variants: {
            size: {
                width: theme.sizes.$chip.iconSize,
                height: theme.sizes.$chip.iconSize,
            },
            type: {
                filled: { color: theme.$intents.contrast },
                outlined: { color: theme.$intents.primary },
                soft: { color: theme.$intents.dark },
            },
            selected: {
                true: {},
                false: {},
            },
        },
        compoundVariants: [
            { type: 'filled', selected: true, styles: { color: theme.$intents.primary } },
            { type: 'outlined', selected: true, styles: { color: theme.colors.text.inverse } },
            { type: 'soft', selected: true, styles: { color: theme.colors.text.inverse } },
        ],
    }),

    deleteButton: (_props: ChipDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        padding: 0,
        marginLeft: 4,
        borderRadius: 12,
        variants: {
            size: {
                width: theme.sizes.$chip.iconSize,
                height: theme.sizes.$chip.iconSize,
            },
        },
    }),

    deleteIcon: (_props: ChipDynamicProps) => ({
        variants: {
            size: {
                fontSize: theme.sizes.$chip.iconSize,
            },
            type: {
                filled: { color: theme.$intents.contrast },
                outlined: { color: theme.$intents.primary },
                soft: { color: theme.$intents.dark },
            },
            selected: {
                true: {},
                false: {},
            },
        },
        compoundVariants: [
            { type: 'filled', selected: true, styles: { color: theme.$intents.primary } },
            { type: 'outlined', selected: true, styles: { color: theme.colors.text.inverse } },
            { type: 'soft', selected: true, styles: { color: theme.colors.text.inverse } },
        ],
    }),
}));
