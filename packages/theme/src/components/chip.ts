import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { Intent } from "../theme/intent";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

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

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedChipStyles>): ExpandedChipStyles => {
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

const createLabelStyles = (theme: Theme, expanded: Partial<ExpandedChipStyles>): ExpandedChipStyles => {
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

const createIconStyles = (theme: Theme, expanded: Partial<ExpandedChipStyles>): ExpandedChipStyles => {
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

const createDeleteButtonStyles = (theme: Theme, expanded: Partial<ExpandedChipStyles>): ExpandedChipStyles => {
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

const createDeleteIconStyles = (theme: Theme, expanded: Partial<ExpandedChipStyles>) => {
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

export const createChipStylesheet = (theme: Theme, expanded?: Partial<ChipStylesheet>): ChipStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        label: createLabelStyles(theme, expanded?.label || {}),
        icon: createIconStyles(theme, expanded?.icon || {}),
        deleteButton: createDeleteButtonStyles(theme, expanded?.deleteButton || {}),
        deleteIcon: createDeleteIconStyles(theme, expanded?.deleteIcon || {}),
    };
}
