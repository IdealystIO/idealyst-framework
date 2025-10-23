import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, Intent} from '@idealyst/theme';
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

function createContainerStyles(theme: Theme): ExpandedChipStyles {
    return ({ intent, selected }: ChipVariants) => {
        return {
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
        };
    }
}

function createLabelStyles(theme: Theme): ExpandedChipStyles {
    return ({intent, selected}: ChipVariants) => {
        return {
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
        };
    }
}

function createIconStyles(theme: Theme): ExpandedChipStyles {
    return ({ intent, selected }: ChipVariants) => {
        return {
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
        };
    }
}

function createDeleteIconStyles(theme: Theme) {
    return ({ intent, selected }: ChipVariants) => {
        return {
            variants: {
                size: buildSizeVariants(theme, 'chip', (size) => ({
                    fontSize: size.iconSize,
                })),
                type: createLabelVariants(theme, intent, selected)
            }

        };
    };
}

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const chipStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: createContainerStyles(theme),
    label: createLabelStyles(theme),
    icon: createIconStyles(theme),
    deleteButton: {
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
    },
    deleteIcon: createDeleteIconStyles(theme),
  };
});