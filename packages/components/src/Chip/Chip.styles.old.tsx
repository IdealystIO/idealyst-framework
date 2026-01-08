import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent } from '@idealyst/theme';
import { applyExtensions } from '../extensions/applyExtension';

type ChipSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ChipType = 'filled' | 'outlined' | 'soft';
type ChipIntent = Intent;

type ChipDynamicProps = {
    size: ChipSize;
    intent: ChipIntent;
    type: ChipType;
    selected: boolean;
    disabled?: boolean;
};

type ChipDeleteButtonProps = {
    size: ChipSize;
};

/**
 * Create container styles
 */
function createContainerStyles(theme: Theme) {
    return ({ size, intent, type, selected, disabled = false }: ChipDynamicProps) => {
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
    };
}

/**
 * Create label styles
 */
function createLabelStyles(theme: Theme) {
    return ({ size, intent, type, selected }: ChipDynamicProps) => {
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
            fontFamily: 'inherit',
            fontWeight: '500' as const,
            fontSize: sizeValue.fontSize as number,
            lineHeight: sizeValue.lineHeight as number,
            color,
        } as const;
    };
}

/**
 * Create icon styles
 */
function createIconStyles(theme: Theme) {
    return ({ size, intent, type, selected }: ChipDynamicProps) => {
        const intentValue = theme.intents[intent];
        const sizeValue = theme.sizes.chip[size];

        // Compute color based on type and selected state (same logic as label)
        let color: string;

        if (type === 'filled') {
            color = selected ? intentValue.primary : intentValue.contrast;
        } else if (type === 'outlined') {
            color = selected ? theme.colors.text.inverse : intentValue.primary;
        } else { // soft
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
    };
}

/**
 * Create delete button styles
 */
function createDeleteButtonStyles(theme: Theme) {
    return ({ size }: ChipDeleteButtonProps) => {
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
    };
}

/**
 * Create delete icon styles
 */
function createDeleteIconStyles(theme: Theme) {
    return ({ size, intent, type, selected }: ChipDynamicProps) => {
        const intentValue = theme.intents[intent];
        const sizeValue = theme.sizes.chip[size];

        // Compute color based on type and selected state (same logic as label/icon)
        let color: string;

        if (type === 'filled') {
            color = selected ? intentValue.primary : intentValue.contrast;
        } else if (type === 'outlined') {
            color = selected ? theme.colors.text.inverse : intentValue.primary;
        } else { // soft
            color = selected ? theme.colors.text.inverse : intentValue.dark;
        }

        return {
            fontSize: sizeValue.iconSize as number,
            color,
        } as const;
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const chipStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements

    return applyExtensions('Chip', theme, {container: createContainerStyles(theme),
        label: createLabelStyles(theme),
        icon: createIconStyles(theme),
        // Additional styles (merged from return)
        // Minor utility styles (not extended)
        deleteButton: createDeleteButtonStyles(theme),
        deleteIcon: createDeleteIconStyles(theme)});
});
