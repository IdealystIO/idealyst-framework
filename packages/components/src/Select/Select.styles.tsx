/**
 * Select styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type SelectType = 'outlined' | 'filled';

export type SelectDynamicProps = {
    size?: Size;
    intent?: Intent;
    type?: SelectType;
    disabled?: boolean;
    error?: boolean;
    focused?: boolean;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * Select styles with type/intent/error/focused handling.
 */
export const selectStyles = defineStyle('Select', (theme: Theme) => ({
    container: (_props: SelectDynamicProps) => ({
        position: 'relative' as const,
        _web: {
            display: 'inline-flex',
            flexDirection: 'column',
        },
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
    }),

    label: (_props: SelectDynamicProps) => ({
        fontSize: 14,
        fontWeight: '500' as const,
        color: theme.colors.text.primary,
        marginBottom: 4,
    }),

    trigger: ({ type = 'outlined', intent = 'neutral', disabled = false, error = false, focused = false }: SelectDynamicProps) => {
        // Determine border color based on state priority: error > focused > default
        const getBorderColor = () => {
            if (error) return theme.intents.danger.primary;
            if (focused) return theme.intents[intent]?.primary ?? theme.intents.primary.primary;
            return type === 'filled' ? 'transparent' : theme.colors.border.primary;
        };

        const borderColor = getBorderColor();

        return {
            position: 'relative' as const,
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'space-between' as const,
            borderWidth: 1,
            borderStyle: 'solid' as const,
            borderColor,
            borderRadius: 8,
            opacity: disabled ? 0.6 : 1,
            backgroundColor: type === 'filled' ? theme.colors.surface.secondary : theme.colors.surface.primary,
            variants: {
                size: theme.sizes.$select,
            },
            _web: {
                display: 'flex',
                boxSizing: 'border-box',
                cursor: disabled ? 'not-allowed' : 'pointer',
                border: `1px solid ${borderColor}`,
                boxShadow: focused && !error ? `0 0 0 2px ${theme.intents[intent]?.primary ?? theme.intents.primary.primary}33` : 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                _hover: disabled ? {} : { borderColor: focused || error ? borderColor : theme.colors.border.secondary },
                _active: disabled ? {} : { opacity: 0.9 },
                _focus: { outline: 'none' },
            },
        };
    },

    triggerContent: (_props: SelectDynamicProps) => ({
        flex: 1,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
    }),

    triggerText: (_props: SelectDynamicProps) => ({
        color: theme.colors.text.primary,
        flex: 1,
        variants: {
            size: {
                fontSize: theme.sizes.$select.fontSize,
            },
        },
    }),

    placeholder: (_props: SelectDynamicProps) => ({
        color: theme.colors.text.secondary,
        variants: {
            size: {
                fontSize: theme.sizes.$select.fontSize,
            },
        },
    }),

    icon: (_props: SelectDynamicProps) => ({
        marginLeft: 4,
        color: theme.colors.text.secondary,
    }),

    chevron: (_props: SelectDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginLeft: 4,
        color: theme.colors.text.secondary,
        variants: {
            size: {
                width: theme.sizes.$select.iconSize,
                height: theme.sizes.$select.iconSize,
            },
        },
        _web: {
            transition: 'transform 0.2s ease',
        },
    }),

    chevronOpen: (_props: SelectDynamicProps) => ({
        _web: {
            transform: 'rotate(180deg)',
        },
    }),

    dropdown: (_props: SelectDynamicProps) => ({
        position: 'absolute' as const,
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: theme.colors.surface.primary,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'solid' as const,
        borderColor: theme.colors.border.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
        zIndex: 9999,
        maxHeight: 240,
        minWidth: 200,
        overflow: 'hidden' as const,
        _web: {
            border: `1px solid ${theme.colors.border.primary}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
            overflowY: 'auto',
        },
    }),

    searchContainer: (_props: SelectDynamicProps) => ({
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
        _web: {
            borderBottom: `1px solid ${theme.colors.border.primary}`,
        },
    }),

    searchInput: (_props: SelectDynamicProps) => ({
        padding: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid' as const,
        borderColor: theme.colors.border.primary,
        backgroundColor: theme.colors.surface.primary,
        variants: {
            size: {
                fontSize: theme.sizes.$select.fontSize,
            },
        },
        _web: {
            border: `1px solid ${theme.colors.border.primary}`,
            outline: 'none',
            _focus: {
                borderColor: theme.intents.primary.primary,
            },
        },
    }),

    optionsList: (_props: SelectDynamicProps) => ({
        paddingVertical: 4,
    }),

    option: ({ disabled = false }: SelectDynamicProps) => ({
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        minHeight: 36,
        opacity: disabled ? theme.interaction.opacity.disabled : 1,
        _web: {
            display: 'flex',
            cursor: disabled ? 'not-allowed' : 'pointer',
            _hover: disabled ? {} : { backgroundColor: theme.colors.surface.secondary },
            _active: disabled ? {} : { opacity: 0.8 },
        },
    }),

    optionFocused: (_props: SelectDynamicProps) => ({
        backgroundColor: theme.interaction.focusedBackground,
        _web: {
            outline: `1px solid ${theme.interaction.focusBorder}`,
            outlineOffset: -1,
        },
    }),

    optionDisabled: (_props: SelectDynamicProps) => ({
        opacity: theme.interaction.opacity.disabled,
        _web: {
            cursor: 'not-allowed',
        },
    }),

    optionContent: (_props: SelectDynamicProps) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        flex: 1,
    }),

    optionIcon: (_props: SelectDynamicProps) => ({
        marginRight: 4,
    }),

    optionText: (_props: SelectDynamicProps) => ({
        color: theme.colors.text.primary,
        flex: 1,
        variants: {
            size: {
                fontSize: theme.sizes.$select.fontSize,
            },
        },
    }),

    optionTextDisabled: (_props: SelectDynamicProps) => ({
        color: theme.colors.text.secondary,
    }),

    helperText: ({ error = false }: SelectDynamicProps) => ({
        fontSize: 12,
        marginTop: 4,
        color: error ? theme.intents.danger.primary : theme.colors.text.secondary,
    }),

    overlay: (_props: SelectDynamicProps) => ({
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        _web: {
            position: 'fixed',
        },
    }),
}));
