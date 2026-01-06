import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent } from '@idealyst/theme';
import { applyExtensions } from '../extensions/applyExtension';

type DividerOrientation = 'horizontal' | 'vertical';
type DividerThickness = 'thin' | 'md' | 'thick';
type DividerType = 'solid' | 'dashed' | 'dotted';
type DividerIntent = Intent | 'secondary' | 'neutral' | 'info';
type DividerLength = 'full' | 'auto';
type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

type DividerDynamicProps = {
    orientation?: DividerOrientation;
    thickness?: DividerThickness;
    type?: DividerType;
    intent?: DividerIntent;
    spacing?: DividerSpacing;
};

type LineDynamicProps = {
    orientation?: DividerOrientation;
    thickness?: DividerThickness;
};

function getIntentColor(theme: Theme, intent: DividerIntent): string {
    if (intent === 'secondary') return theme.colors.border.primary;
    if (intent === 'neutral') return theme.colors.border.secondary;
    if (intent === 'info') return theme.intents.primary.primary;
    return theme.intents[intent as Intent].primary;
}

function getThicknessValue(thickness: DividerThickness): number {
    switch (thickness) {
        case 'thin': return 1;
        case 'md': return 2;
        case 'thick': return 4;
        default: return 1;
    }
}

function getSpacingValue(spacing: DividerSpacing): number {
    switch (spacing) {
        case 'none': return 0;
        case 'sm': return 8;
        case 'md': return 16;
        case 'lg': return 24;
        default: return 0;
    }
}

/**
 * Create dynamic divider styles
 */
function createDividerStyles(theme: Theme) {
    return ({
        orientation = 'horizontal',
        thickness = 'thin',
        type = 'solid',
        intent = 'neutral',
        spacing = 'md'
    }: DividerDynamicProps) => {
        const color = getIntentColor(theme, intent);
        const thicknessValue = getThicknessValue(thickness);
        const spacingValue = getSpacingValue(spacing);

        const isHorizontal = orientation === 'horizontal';
        const isDashedOrDotted = type === 'dashed' || type === 'dotted';

        // Base dimension styles based on orientation and thickness
        const dimensionStyles = isHorizontal
            ? { width: '100%', height: thicknessValue, flexDirection: 'row' as const }
            : { width: thicknessValue, height: '100%', flexDirection: 'column' as const };

        // Spacing styles based on orientation
        const spacingStyles = isHorizontal
            ? { marginVertical: spacingValue }
            : { marginHorizontal: spacingValue };

        // Web-specific border styles for dashed/dotted
        const webBorderStyles = isDashedOrDotted ? {
            border: 'none',
            backgroundColor: 'transparent',
            ...(isHorizontal
                ? { borderTop: `${thicknessValue}px ${type} ${color}` }
                : { borderLeft: `${thicknessValue}px ${type} ${color}` }
            ),
        } : {};

        return {
            backgroundColor: isDashedOrDotted ? 'transparent' : color,
            ...dimensionStyles,
            ...spacingStyles,
            variants: {
                length: {
                    full: {},
                    auto: {},
                },
            },
            _web: webBorderStyles,
        } as const;
    };
}

/**
 * Create dynamic line styles (for dividers with content)
 */
function createLineStyles(theme: Theme) {
    return ({ orientation = 'horizontal', thickness = 'thin' }: LineDynamicProps) => {
        const thicknessValue = getThicknessValue(thickness);
        const isHorizontal = orientation === 'horizontal';

        return {
            backgroundColor: theme.colors.border.secondary,
            flex: 1,
            ...(isHorizontal
                ? { height: thicknessValue }
                : { width: thicknessValue }
            ),
        } as const;
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
export const dividerStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('Divider', theme, {
        divider: createDividerStyles(theme),
    });

    return {
        ...extended,
        // Minor utility styles (not extended)
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            variants: {
                orientation: {
                    horizontal: {
                        flexDirection: 'row',
                        width: '100%',
                    },
                    vertical: {
                        flexDirection: 'column',
                        height: '100%',
                    },
                },
                spacing: {
                    none: { gap: 0 },
                    xs: { gap: 4 },
                    sm: { gap: 8 },
                    md: { gap: 16 },
                    lg: { gap: 24 },
                    xl: { gap: 32 },
                },
            },
        },
        content: {
            backgroundColor: theme.colors.surface.primary,
            color: theme.colors.text.secondary,
            fontSize: 14,
            variants: {
                orientation: {
                    horizontal: {
                        paddingHorizontal: 8,
                    },
                    vertical: {
                        paddingVertical: 8,
                    },
                },
            },
        },
        line: createLineStyles(theme),
    };
});