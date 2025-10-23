import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";

type DividerOrientation = 'horizontal' | 'vertical';
type DividerThickness = 'thin' | 'md' | 'thick';
type DividerType = 'solid' | 'dashed' | 'dotted';
type DividerIntent = Intent | 'secondary' | 'neutral' | 'info';
type DividerLength = 'full' | 'auto';
type DividerSpacing = 'none' | 'sm' | 'md' | 'lg';

type DividerVariants = {
    orientation: DividerOrientation;
    thickness: DividerThickness;
    type: DividerType;
    intent: DividerIntent;
    length: DividerLength;
    spacing: DividerSpacing;
}

export type ExpandedDividerStyles = StylesheetStyles<keyof DividerVariants>;

export type DividerStylesheet = {
    divider: ExpandedDividerStyles;
    container: ExpandedDividerStyles;
    content: ExpandedDividerStyles;
    line: ExpandedDividerStyles;
}

/**
 * Helper to get intent colors
 */
function getIntentColor(theme: Theme, intent: DividerIntent): string {
    if (intent === 'secondary') return theme.colors?.border?.primary || '#e0e0e0';
    if (intent === 'neutral') return theme.colors?.border?.secondary || '#f0f0f0';
    if (intent === 'info') return theme.intents.primary.primary;
    return theme.intents[intent as Intent].primary;
}

/**
 * Create compound variants for divider
 */
function createDividerCompoundVariants(theme: Theme): CompoundVariants<keyof DividerVariants> {
    const variants: CompoundVariants<keyof DividerVariants> = [];

    // Horizontal thickness variants
    variants.push(
        { orientation: 'horizontal', thickness: 'thin', styles: { height: 1 } },
        { orientation: 'horizontal', thickness: 'md', styles: { height: 2 } },
        { orientation: 'horizontal', thickness: 'thick', styles: { height: 4 } }
    );

    // Vertical thickness variants
    variants.push(
        { orientation: 'vertical', thickness: 'thin', styles: { width: 1 } },
        { orientation: 'vertical', thickness: 'md', styles: { width: 2 } },
        { orientation: 'vertical', thickness: 'thick', styles: { width: 4 } }
    );

    // Horizontal spacing variants
    variants.push(
        { orientation: 'horizontal', spacing: 'sm', styles: { marginVertical: theme.spacing?.sm || 8 } },
        { orientation: 'horizontal', spacing: 'md', styles: { marginVertical: theme.spacing?.md || 16 } },
        { orientation: 'horizontal', spacing: 'lg', styles: { marginVertical: theme.spacing?.lg || 24 } }
    );

    // Vertical spacing variants
    variants.push(
        { orientation: 'vertical', spacing: 'sm', styles: { marginHorizontal: theme.spacing?.sm || 8 } },
        { orientation: 'vertical', spacing: 'md', styles: { marginHorizontal: theme.spacing?.md || 16 } },
        { orientation: 'vertical', spacing: 'lg', styles: { marginHorizontal: theme.spacing?.lg || 24 } }
    );

    // Dashed variant compound styles
    const borderColor = theme.colors?.border?.secondary || '#f0f0f0';
    variants.push(
        {
            type: 'dashed',
            orientation: 'horizontal',
            styles: {
                _web: {
                    borderTop: `1px dashed ${borderColor}`,
                    borderLeft: 'none',
                },
            },
        },
        {
            type: 'dashed',
            orientation: 'vertical',
            styles: {
                _web: {
                    borderLeft: `1px dashed ${borderColor}`,
                    borderTop: 'none',
                },
            },
        }
    );

    // Dotted variant compound styles
    variants.push(
        {
            type: 'dotted',
            orientation: 'horizontal',
            styles: {
                _web: {
                    borderTop: `1px dotted ${borderColor}`,
                    borderLeft: 'none',
                },
            },
        },
        {
            type: 'dotted',
            orientation: 'vertical',
            styles: {
                _web: {
                    borderLeft: `1px dotted ${borderColor}`,
                    borderTop: 'none',
                },
            },
        }
    );

    // Intent colors for dashed/dotted (simplified - only key intents)
    const intents: DividerIntent[] = ['primary', 'success', 'error', 'warning', 'info'];
    for (const intent of intents) {
        const color = getIntentColor(theme, intent);

        // Dashed horizontal
        variants.push({
            type: 'dashed',
            intent: intent,
            orientation: 'horizontal',
            styles: {
                borderTopColor: color,
                _web: { borderTop: `1px dashed ${color}` },
            },
        });

        // Dashed vertical
        variants.push({
            type: 'dashed',
            intent: intent,
            orientation: 'vertical',
            styles: {
                borderLeftColor: color,
                _web: { borderLeft: `1px dashed ${color}` },
            },
        });

        // Dotted horizontal
        variants.push({
            type: 'dotted',
            intent: intent,
            orientation: 'horizontal',
            styles: {
                borderTopColor: color,
                _web: { borderTop: `1px dotted ${color}` },
            },
        });

        // Dotted vertical
        variants.push({
            type: 'dotted',
            intent: intent,
            orientation: 'vertical',
            styles: {
                borderLeftColor: color,
                _web: { borderLeft: `1px dotted ${color}` },
            },
        });
    }

    return variants;
}

/**
 * Create compound variants for line segments
 */
function createLineCompoundVariants(): CompoundVariants<keyof DividerVariants> {
    return [
        { orientation: 'horizontal', thickness: 'thin', styles: { height: 1 } },
        { orientation: 'horizontal', thickness: 'md', styles: { height: 2 } },
        { orientation: 'horizontal', thickness: 'thick', styles: { height: 4 } },
        { orientation: 'vertical', thickness: 'thin', styles: { width: 1 } },
        { orientation: 'vertical', thickness: 'md', styles: { width: 2 } },
        { orientation: 'vertical', thickness: 'thick', styles: { width: 4 } },
    ];
}

const createDividerStyles = (theme: Theme, expanded: Partial<ExpandedDividerStyles>): ExpandedDividerStyles => {
    return deepMerge({
        backgroundColor: theme.colors?.border?.secondary || '#f0f0f0',
        variants: {
            orientation: {
                horizontal: {
                    width: '100%',
                    height: 1,
                    flexDirection: 'row',
                },
                vertical: {
                    width: 1,
                    height: '100%',
                    flexDirection: 'column',
                },
            },
            thickness: {
                thin: {},
                md: {},
                thick: {},
            },
            type: {
                solid: {},
                dashed: {
                    backgroundColor: 'transparent',
                    _web: {
                        border: 'none',
                        backgroundColor: 'transparent',
                    },
                },
                dotted: {
                    backgroundColor: 'transparent',
                    _web: {
                        border: 'none',
                        backgroundColor: 'transparent',
                    },
                },
            },
            intent: {
                primary: { backgroundColor: theme.intents.primary.primary },
                secondary: { backgroundColor: theme.colors?.border?.primary || '#e0e0e0' },
                neutral: { backgroundColor: theme.colors?.border?.secondary || '#f0f0f0' },
                success: { backgroundColor: theme.intents.success.primary },
                error: { backgroundColor: theme.intents.error.primary },
                warning: { backgroundColor: theme.intents.warning.primary },
                info: { backgroundColor: theme.intents.primary.primary },
            },
            length: {
                full: {},
                auto: {},
            },
            spacing: {
                none: { margin: 0 },
                sm: {},
                md: {},
                lg: {},
            },
        },
        compoundVariants: createDividerCompoundVariants(theme),
    }, expanded);
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedDividerStyles>): ExpandedDividerStyles => {
    return deepMerge({
        alignItems: 'center',
        justifyContent: 'center',
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
                sm: { gap: theme.spacing?.sm || 8 },
                md: { gap: theme.spacing?.md || 16 },
                lg: { gap: theme.spacing?.lg || 24 },
            },
        },
    }, expanded);
}

const createContentStyles = (theme: Theme, expanded: Partial<ExpandedDividerStyles>): ExpandedDividerStyles => {
    return deepMerge({
        backgroundColor: theme.colors?.surface?.primary || '#ffffff',
        color: theme.colors?.text?.secondary || '#666666',
        fontSize: theme.typography?.fontSize?.sm || 14,
        variants: {
            orientation: {
                horizontal: {
                    paddingHorizontal: theme.spacing?.sm || 8,
                },
                vertical: {
                    paddingVertical: theme.spacing?.sm || 8,
                },
            },
        },
    }, expanded);
}

const createLineStyles = (theme: Theme, expanded: Partial<ExpandedDividerStyles>): ExpandedDividerStyles => {
    return deepMerge({
        backgroundColor: theme.colors?.border?.secondary || '#f0f0f0',
        flex: 1,
        variants: {
            orientation: {
                horizontal: { height: 1 },
                vertical: { width: 1 },
            },
            thickness: {
                thin: {},
                md: {},
                thick: {},
            },
        },
        compoundVariants: createLineCompoundVariants(),
    }, expanded);
}

export const createDividerStylesheet = (theme: Theme, expanded?: Partial<DividerStylesheet>): DividerStylesheet => {
    return {
        divider: createDividerStyles(theme, expanded?.divider || {}),
        container: createContainerStyles(theme, expanded?.container || {}),
        content: createContentStyles(theme, expanded?.content || {}),
        line: createLineStyles(theme, expanded?.line || {}),
    };
}
