/**
 * Checkbox styles using defineStyle with $iterator expansion.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type CheckboxType = 'default' | 'outlined';

export type CheckboxDynamicProps = {
    size?: Size;
    intent?: Intent;
    type?: CheckboxType;
    checked?: boolean;
    disabled?: boolean;
    visible?: boolean;
    error?: boolean;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * Checkbox styles with intent/type/checked handling.
 */
export const checkboxStyles = defineStyle('Checkbox', (theme: Theme) => ({
    wrapper: (_props: CheckboxDynamicProps) => ({
        flexDirection: 'column' as const,
        gap: 4,
        variants: {
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
            alignItems: 'flex-start',
            width: 'auto',
        },
    }),

    container: (_props: CheckboxDynamicProps) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 8,
        _web: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            width: 'fit-content',
            cursor: 'pointer',
        },
    }),

    checkbox: (_props: CheckboxDynamicProps) => ({
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        borderRadius: 4,
        position: 'relative' as const,
        borderStyle: 'solid' as const,
        variants: {
            size: {
                xs: { width: 14, height: 14 },
                sm: { width: 16, height: 16 },
                md: { width: 20, height: 20 },
                lg: { width: 24, height: 24 },
                xl: { width: 28, height: 28 },
            },
            type: {
                default: { borderWidth: 1 },
                outlined: { borderWidth: 2 },
            },
            checked: {
                false: {
                    backgroundColor: 'transparent',
                    borderColor: theme.colors.border.primary,
                },
            },
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
        compoundVariants: [
            {
                checked: true,
                styles: {
                    backgroundColor: theme.$intents.primary,
                    borderColor: theme.$intents.primary,
                },
            },
        ],
        _web: {
            outline: 'none',
            display: 'flex',
            boxSizing: 'border-box',
            userSelect: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            transition: 'all 0.2s ease',
            _focus: {
                outline: `2px solid ${theme.intents.primary.primary}`,
                outlineOffset: '2px',
            },
        },
    }),

    checkmark: (_props: CheckboxDynamicProps) => ({
        position: 'absolute' as const,
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        color: '#ffffff',
        variants: {
            size: {
                xs: { width: 10, height: 10 },
                sm: { width: 12, height: 12 },
                md: { width: 14, height: 14 },
                lg: { width: 16, height: 16 },
                xl: { width: 20, height: 20 },
            },
            checked: {
                true: { opacity: 1 },
                false: { opacity: 0 },
            },
        },
    }),

    label: (_props: CheckboxDynamicProps) => ({
        color: theme.colors.text.primary,
        variants: {
            size: {
                xs: { fontSize: 12 },
                sm: { fontSize: 14 },
                md: { fontSize: 16 },
                lg: { fontSize: 18 },
                xl: { fontSize: 20 },
            },
            disabled: {
                true: { opacity: 0.5 },
                false: { opacity: 1 },
            },
        },
        _web: {
            display: 'block',
            textAlign: 'left',
            margin: 0,
            padding: 0,
        },
    }),

    helperText: (_props: CheckboxDynamicProps) => ({
        fontSize: 14,
        marginTop: 2,
        variants: {
            error: {
                true: { color: theme.intents.danger.primary },
                false: { color: theme.colors.text.secondary },
            },
        },
    }),
}));
