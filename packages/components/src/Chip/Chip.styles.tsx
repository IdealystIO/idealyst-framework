import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent} from '@idealyst/theme';
import { deepMerge } from '../utils/deepMerge';
import { buildSizeVariants } from '../utils/buildSizeVariants';

type ChipSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ChipType = 'filled' | 'outlined' | 'soft';
type ChipIntent = Intent;

type ChipVariants = {
    size: ChipSize;
    type: ChipType;
    intent: ChipIntent;
    selected: boolean;
    disabled: boolean;
    selectable: boolean;
}

export type ExpandedChipStyles = StylesheetStyles<keyof ChipVariants>;

export type ChipStylesheet = {
    container: ExpandedChipStyles;
    label: ExpandedChipStyles;
    icon: ExpandedChipStyles;
    deleteButton: ExpandedChipStyles;
    deleteIcon: ExpandedChipStyles;
}

/**
 * Create size variants for container
 */
function createContainerSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'chip', (size) => ({
        paddingHorizontal: size.paddingHorizontal,
        paddingVertical: size.paddingVertical,
        minHeight: size.minHeight,
        borderRadius: size.borderRadius,
    }));
}

/**
 * Create compound variants for container (type + intent + selected)
 */
function createContainerVariants(theme: Theme, intent: Intent, selected: boolean)  {

    const intentValue = theme.intents[intent];
    const primaryColor = selected ? intentValue.contrast : intentValue.primary;
    const secondaryColor = selected ? intentValue.primary : 'transparent';

    return {
        filled: {
            backgroundColor: primaryColor,
            borderColor: secondaryColor,
            borderWidth: 1,
            borderStyle: 'solid',
        },
        outlined: {
            backgroundColor: secondaryColor,
            borderColor: primaryColor,
            borderWidth: 1,
            borderStyle: 'solid',
        },
        soft: {
            backgroundColor: !selected ? intentValue.light : intentValue.primary,
        },
    };
}

/**
 * Create compound variants for label
 */
function createLabelVariants(theme: Theme, intent: Intent, selected: boolean) {
    const intentValue = theme.intents[intent];
    const primaryColor = selected ? intentValue.primary : intentValue.contrast;
    const secondaryColor = selected ?  theme.colors.text.inverse : intentValue.primary;
    return {
        filled: {
            color: primaryColor,
        },
        outlined: {
            color: secondaryColor,
        },
        soft: {
            color: !selected ? intentValue.dark : theme.colors.text.inverse,
        },
    };
}

function createContainerStyles(theme: Theme, expanded: Partial<ExpandedChipStyles>): ExpandedChipStyles {
    return ({ intent, selected }: ChipVariants) => {
        return deepMerge({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 0,
            gap: 4,
            variants: {
                size: createContainerSizeVariants(theme),
                type: createContainerVariants(theme, intent, selected),
                disabled: {
                    true: { opacity: 0.5 },
                },
            },
        }, expanded);
    }
}

function createLabelStyles(theme: Theme, expanded: Partial<ExpandedChipStyles>): ExpandedChipStyles {
    return ({intent, selected}: ChipVariants) => {
        return deepMerge({
            fontFamily: 'inherit', // TODO: Add typography to theme
            fontWeight: 500,
            variants: {
                size: buildSizeVariants(theme, 'chip', (size) => ({
                    fontSize: size.fontSize,
                    lineHeight: size.lineHeight,
                })),
                selected: {
                    true: {},
                    false: {},
                },
                type: createLabelVariants(theme, intent, selected)
            },
        }, expanded);
    }
}

function createIconStyles(theme: Theme, expanded: Partial<ExpandedChipStyles>): ExpandedChipStyles {
    return ({ intent, selected }: ChipVariants) => {
        return deepMerge({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            variants: {
                size: buildSizeVariants(theme, 'chip', (size) => ({
                    width: size.iconSize,
                    height: size.iconSize,
                })),
                selected: {
                    true: {},
                    false: {},
                },
                type: createLabelVariants(theme, intent, selected)
            },
        }, expanded);
    }
}

function createDeleteButtonStyles(theme: Theme, expanded: Partial<ExpandedChipStyles>): ExpandedChipStyles {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        marginLeft: 4,
        borderRadius: 12,
        variants: {
            size: buildSizeVariants(theme, 'chip', (size) => ({
                width: size.iconSize,
                height: size.iconSize,
            })),
        },
    }, expanded);
}

function createDeleteIconStyles(theme: Theme, expanded: Partial<ExpandedChipStyles>) {
    return ({ intent, selected }: ChipVariants) => {
        return deepMerge({
            variants: {
                size: buildSizeVariants(theme, 'chip', (size) => ({
                    fontSize: size.iconSize,
                })),
                type: createLabelVariants(theme, intent, selected)
            }

        }, expanded);
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const chipStyles: ReturnType<typeof createChipStylesheet> = StyleSheet.create((theme: Theme) => {
  return {
    container: createContainerStyles(theme, {}),
    label: createLabelStyles(theme, {}),
    icon: createIconStyles(theme, {}),
    deleteButton: createDeleteButtonStyles(theme, {}),
    deleteIcon: createDeleteIconStyles(theme, {}),
  };
});

function createChipStylesheet(theme: Theme, expanded?: Partial<ChipStylesheet>): ChipStylesheet {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
        icon: createIconStyles(theme, expanded?.icon || {}),
        deleteButton: createDeleteButtonStyles(theme, expanded?.deleteButton || {}),
        deleteIcon: createDeleteIconStyles(theme, expanded?.deleteIcon || {}),
    };
}
