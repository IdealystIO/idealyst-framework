/**
 * Divider styles using defineStyle with dynamic functions.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type DividerOrientation = 'horizontal' | 'vertical';
type DividerThickness = 'thin' | 'md' | 'thick';
type DividerType = 'solid' | 'dashed' | 'dotted';
type DividerIntent = Intent | 'secondary' | 'neutral' | 'info';
type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';
type DividerLength = 'full' | 'auto';

export type DividerDynamicProps = {
    orientation?: DividerOrientation;
    thickness?: DividerThickness;
    type?: DividerType;
    intent?: DividerIntent;
    spacing?: DividerSpacing;
};

export type LineDynamicProps = {
    orientation?: DividerOrientation;
    thickness?: DividerThickness;
};

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
 * Divider styles with dynamic functions for orientation/thickness/intent combinations.
 */
export const dividerStyles = defineStyle('Divider', (theme: Theme) => ({
    divider: ({
        orientation = 'horizontal',
        thickness = 'thin',
        type = 'solid',
        intent = 'neutral',
        spacing = 'md'
    }: DividerDynamicProps) => {
        const thicknessValue = getThicknessValue(thickness);
        const spacingValue = getSpacingValue(spacing);
        const isHorizontal = orientation === 'horizontal';
        const isDashedOrDotted = type === 'dashed' || type === 'dotted';

        // Get color based on intent - inline for Unistyles to trace
        const color = intent === 'secondary'
            ? theme.colors.border.primary
            : intent === 'neutral'
                ? theme.colors.border.secondary
                : intent === 'info'
                    ? theme.intents.primary.primary
                    : theme.intents[intent as Intent].primary;

        const dimensionStyles = isHorizontal
            ? { width: '100%', height: thicknessValue, flexDirection: 'row' as const }
            : { width: thicknessValue, height: '100%', flexDirection: 'column' as const };

        const spacingStyles = isHorizontal
            ? { marginVertical: spacingValue }
            : { marginHorizontal: spacingValue };

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
    },

    container: (_props: { orientation?: DividerOrientation; spacing?: DividerSpacing }) => ({
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        variants: {
            orientation: {
                horizontal: { flexDirection: 'row', width: '100%' },
                vertical: { flexDirection: 'column', height: '100%' },
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
    }),

    content: (_props: { orientation?: DividerOrientation }) => ({
        backgroundColor: theme.colors.surface.primary,
        color: theme.colors.text.secondary,
        fontSize: 14,
        variants: {
            orientation: {
                horizontal: { paddingHorizontal: 8 },
                vertical: { paddingVertical: 8 },
            },
        },
    }),

    line: ({ orientation = 'horizontal', thickness = 'thin' }: LineDynamicProps) => {
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
    },
}));
