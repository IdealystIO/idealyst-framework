import { StyleSheet } from 'react-native-unistyles';
import { Theme, Intent} from '@idealyst/theme';
import { CompoundVariants, StylesheetStyles } from '@idealyst/theme/src/styles';

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

function getIntentColor(theme: Theme, intent: DividerIntent): string {
    if (intent === 'secondary') return theme.colors.border.primary;
    if (intent === 'neutral') return theme.colors.border.secondary;
    if (intent === 'info') return theme.intents.primary.primary;
    return theme.intents[intent as Intent].primary;
}

function createDividerCompoundVariants(theme: Theme): CompoundVariants<keyof DividerVariants> {
    const variants: CompoundVariants<keyof DividerVariants> = [];

    variants.push(
        { orientation: 'horizontal', thickness: 'thin', styles: { height: 1 } },
        { orientation: 'horizontal', thickness: 'md', styles: { height: 2 } },
        { orientation: 'horizontal', thickness: 'thick', styles: { height: 4 } }
    );

    variants.push(
        { orientation: 'vertical', thickness: 'thin', styles: { width: 1 } },
        { orientation: 'vertical', thickness: 'md', styles: { width: 2 } },
        { orientation: 'vertical', thickness: 'thick', styles: { width: 4 } }
    );

    variants.push(
        { orientation: 'horizontal', spacing: 'sm', styles: { marginVertical: 8 } },
        { orientation: 'horizontal', spacing: 'md', styles: { marginVertical: 16 } },
        { orientation: 'horizontal', spacing: 'lg', styles: { marginVertical: 24 } }
    );

    variants.push(
        { orientation: 'vertical', spacing: 'sm', styles: { marginHorizontal: 8 } },
        { orientation: 'vertical', spacing: 'md', styles: { marginHorizontal: 16 } },
        { orientation: 'vertical', spacing: 'lg', styles: { marginHorizontal: 24 } }
    );

    const borderColor = theme.colors.border.secondary;
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

    const intents: DividerIntent[] = ['primary', 'success', 'error', 'warning', 'info'];
    for (const intent of intents) {
        const color = getIntentColor(theme, intent);

        variants.push({
            type: 'dashed',
            intent: intent,
            orientation: 'horizontal',
            styles: {
                borderTopColor: color,
                _web: { borderTop: `1px dashed ${color}` },
            },
        });

        variants.push({
            type: 'dashed',
            intent: intent,
            orientation: 'vertical',
            styles: {
                borderLeftColor: color,
                _web: { borderLeft: `1px dashed ${color}` },
            },
        });

        variants.push({
            type: 'dotted',
            intent: intent,
            orientation: 'horizontal',
            styles: {
                borderTopColor: color,
                _web: { borderTop: `1px dotted ${color}` },
            },
        });

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

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const dividerStyles = StyleSheet.create((theme: Theme) => {
  return {
    divider: {
        backgroundColor: theme.colors.border.secondary,
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
                secondary: { backgroundColor: theme.colors.border.primary },
                neutral: { backgroundColor: theme.colors.border.secondary },
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
    },
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
                sm: { gap: 8 },
                md: { gap: 16 },
                lg: { gap: 24 },
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
    line: {
        backgroundColor: theme.colors.border.secondary,
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
    },
  };
});