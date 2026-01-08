/**
 * Chip styles using defineStyle with dynamic size/intent/type/selected handling.
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
 * Chip styles with size/intent/type/selected handling.
 */
export const chipStyles = defineStyle('Chip', (theme: Theme) => ({
    container: ({ size = 'md', intent = 'primary', type = 'filled', selected = false, disabled = false }: ChipDynamicProps) => {
        const intentValue = theme.intents[intent];
        const sizeValue = theme.sizes.chip[size];

        // Compute colors based on type and selected state
        let backgroundColor: string;
        let borderColor: string;
        let borderWidth: number;

        if (type === 'filled') {
            borderWidth = 1;
            backgroundColor = selected ? intentValue.contrast : intentValue.primary;
            borderColor = selected ? intentValue.primary : 'transparent';
        } else if (type === 'outlined') {
            borderWidth = 1;
            backgroundColor = selected ? intentValue.primary : 'transparent';
            borderColor = intentValue.primary;
        } else { // soft
            borderWidth = 0;
            backgroundColor = selected ? intentValue.primary : intentValue.light;
            borderColor = 'transparent';
        }

        return {
            display: 'flex' as const,
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            gap: 4,
            paddingHorizontal: sizeValue.paddingHorizontal as number,
            paddingVertical: sizeValue.paddingVertical as number,
            minHeight: sizeValue.minHeight as number,
            borderRadius: sizeValue.borderRadius as number,
            backgroundColor,
            borderColor,
            borderWidth,
            borderStyle: borderWidth > 0 ? ('solid' as const) : undefined,
            opacity: disabled ? 0.5 : 1,
        } as const;
    },

    label: ({ size = 'md', intent = 'primary', type = 'filled', selected = false }: ChipDynamicProps) => {
        const intentValue = theme.intents[intent];
        const sizeValue = theme.sizes.chip[size];

        // Compute color based on type and selected state
        let color: string;
        if (type === 'filled') {
            color = selected ? intentValue.primary : intentValue.contrast;
        } else if (type === 'outlined') {
            color = selected ? theme.colors.text.inverse : intentValue.primary;
        } else { // soft
            color = selected ? theme.colors.text.inverse : intentValue.dark;
        }

        return {
            fontFamily: 'inherit' as const,
            fontWeight: '500' as const,
            fontSize: sizeValue.fontSize as number,
            lineHeight: sizeValue.lineHeight as number,
            color,
        } as const;
    },

    icon: ({ size = 'md', intent = 'primary', type = 'filled', selected = false }: ChipDynamicProps) => {
        const intentValue = theme.intents[intent];
        const sizeValue = theme.sizes.chip[size];

        // Same color logic as label
        let color: string;
        if (type === 'filled') {
            color = selected ? intentValue.primary : intentValue.contrast;
        } else if (type === 'outlined') {
            color = selected ? theme.colors.text.inverse : intentValue.primary;
        } else {
            color = selected ? theme.colors.text.inverse : intentValue.dark;
        }

        return {
            display: 'flex' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            width: sizeValue.iconSize as number,
            height: sizeValue.iconSize as number,
            color,
        } as const;
    },

    deleteButton: ({ size = 'md' }: ChipDynamicProps) => {
        const sizeValue = theme.sizes.chip[size];

        return {
            display: 'flex' as const,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            padding: 0,
            marginLeft: 4,
            borderRadius: 12,
            width: sizeValue.iconSize as number,
            height: sizeValue.iconSize as number,
        } as const;
    },

    deleteIcon: ({ size = 'md', intent = 'primary', type = 'filled', selected = false }: ChipDynamicProps) => {
        const intentValue = theme.intents[intent];
        const sizeValue = theme.sizes.chip[size];

        // Same color logic as label/icon
        let color: string;
        if (type === 'filled') {
            color = selected ? intentValue.primary : intentValue.contrast;
        } else if (type === 'outlined') {
            color = selected ? theme.colors.text.inverse : intentValue.primary;
        } else {
            color = selected ? theme.colors.text.inverse : intentValue.dark;
        }

        return {
            fontSize: sizeValue.iconSize as number,
            color,
        } as const;
    },
}));
