/**
 * Divider styles using defineStyle with dynamic functions.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type DividerOrientation = 'horizontal' | 'vertical';
type DividerSize = Size;
type DividerType = 'solid' | 'dashed' | 'dotted';
type DividerIntent = Intent | 'secondary' | 'neutral' | 'info';
type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

export type DividerDynamicProps = {
    orientation?: DividerOrientation;
    size?: DividerSize;
    type?: DividerType;
    intent?: DividerIntent;
    spacing?: DividerSpacing;
};

export type LineDynamicProps = {
    orientation?: DividerOrientation;
    size?: DividerSize;
};

/**
 * Maps Size to thickness value in pixels.
 * xs=1, sm=1, md=2, lg=3, xl=4
 */
function getSizeValue(size: DividerSize): number {
    switch (size) {
        case 'xs': return 1;
        case 'sm': return 1;
        case 'md': return 2;
        case 'lg': return 3;
        case 'xl': return 4;
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
 * Divider styles with dynamic functions for orientation/size/intent combinations.
 */
export const dividerStyles = defineStyle('Divider', (theme: Theme) => ({
    divider: ({
        orientation = 'horizontal',
        size = 'sm',
        type = 'solid',
        intent = 'neutral',
        spacing = 'md'
    }: DividerDynamicProps) => {
        const sizeValue = getSizeValue(size);
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
                    : (theme.intents[intent as Intent]?.primary ?? theme.colors.border.primary);

        const dimensionStyles = isHorizontal
            ? { width: '100%', height: sizeValue, flexDirection: 'row' as const }
            : { width: sizeValue, height: '100%', flexDirection: 'column' as const };

        const spacingStyles = isHorizontal
            ? { marginVertical: spacingValue }
            : { marginHorizontal: spacingValue };

        const webBorderStyles = isDashedOrDotted ? {
            border: 'none',
            backgroundColor: 'transparent',
            ...(isHorizontal
                ? { borderTop: `${sizeValue}px ${type} ${color}` }
                : { borderLeft: `${sizeValue}px ${type} ${color}` }
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

    line: (_props: LineDynamicProps) => ({
        backgroundColor: theme.colors.border.secondary,
        flex: 1,
        variants: {
            orientation: {
                horizontal: {},
                vertical: {},
            },
            size: {
                xs: {},
                sm: {},
                md: {},
                lg: {},
                xl: {},
            },
        },
        compoundVariants: [
            { orientation: 'horizontal', size: 'xs', styles: { height: 1 } },
            { orientation: 'horizontal', size: 'sm', styles: { height: 1 } },
            { orientation: 'horizontal', size: 'md', styles: { height: 2 } },
            { orientation: 'horizontal', size: 'lg', styles: { height: 3 } },
            { orientation: 'horizontal', size: 'xl', styles: { height: 4 } },
            { orientation: 'vertical', size: 'xs', styles: { width: 1 } },
            { orientation: 'vertical', size: 'sm', styles: { width: 1 } },
            { orientation: 'vertical', size: 'md', styles: { width: 2 } },
            { orientation: 'vertical', size: 'lg', styles: { width: 3 } },
            { orientation: 'vertical', size: 'xl', styles: { width: 4 } },
        ],
    }),
}));
