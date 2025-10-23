import {  StylesheetStyles } from "../styles";
import {  Size, Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";
import { ColorVariant } from "../variants";
import { buildSizeVariants } from "../variants/size";

type BadgeType = 'filled' | 'outlined' | 'dot';

type BadgeVariants = {
    size: Size;
    type: BadgeType;
    color: ColorVariant
}

export type ExpandedBadgeStyles = StylesheetStyles<keyof BadgeVariants>;

export type BadgeStylesheet = {
    badge: ExpandedBadgeStyles;
    content: ExpandedBadgeStyles;
    icon: ExpandedBadgeStyles;
    text: ExpandedBadgeStyles;
}


/**
 * Create type variants for badge
 */
function createBadgeTypeVariants(theme: Theme, color: ColorVariant) {
    const colorValue = theme.colors[color]
    return {
        filled: {
            borderWidth: 0,
            backgroundColor: colorValue,
        },
        outlined: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colorValue,
        },
        dot: {
            minWidth: 8,
            width: 8,
            height: 8,
            paddingHorizontal: 0,
            paddingVertical: 0,
            backgroundColor: colorValue,
        },
    };
}


/**
 * Create compound variants for text (type + intent combinations for outlined variant)
 */
function createTextTypeVariants(theme: Theme, color: ColorVariant){
    const colorValue = theme.colors.pallet[color];
    return {
        filled: {
            color: colorValue
        },
        outlined: {
            color: colorValue,
        },
        dot: {
            display: 'none',
        },
    }
}


/**
 * Generate badge container styles
 */
const createBadgeStyles = (theme: Theme, expanded?: Partial<ExpandedBadgeStyles>) => {
    return ({ color }: BadgeVariants) => {
        return deepMerge({
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 9999,
            variants: {
                size: buildSizeVariants(theme, 'badge', (size) => ({
                    minWidth: size.minWidth,
                    height: size.height,
                    paddingHorizontal: size.paddingHorizontal,
                })),
                type: createBadgeTypeVariants(theme, color),
            },
            _web: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                fontWeight: '600',
                lineHeight: 1,
            },
        }, expanded);
    }
}

/**
 * Generate badge content container styles
 */
const createContentStyles = (theme: Theme, expanded?: Partial<ExpandedBadgeStyles>) => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    }, expanded);
}

/**
 * Generate badge icon styles
 */
const createIconStyles = (theme: Theme, expanded?: Partial<ExpandedBadgeStyles>) => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        variants: {
            size: buildSizeVariants(theme, 'badge', (size) => ({
                width: size.iconSize,
                height: size.iconSize,
            })),
        },
    }, expanded);
}

/**
 * Generate badge text styles
 */
const createTextStyles = (theme: Theme, expanded?: Partial<ExpandedBadgeStyles>) => {
    return ({ color }: BadgeVariants) => {
        return deepMerge({
            fontWeight: '600',
            textAlign: 'center',
            variants: {
                size: buildSizeVariants(theme, 'badge', (size) => ({
                    fontSize: size.fontSize,
                    lineHeight: size.lineHeight,
                })),
                type: createTextTypeVariants(theme, color),
            },
        }, expanded);
    };
}

/**
 * Generate badge stylesheet
 */
export const createBadgeStylesheet = (theme: Theme, expanded?: Partial<BadgeStylesheet>) => {
    return {
        badge: createBadgeStyles(theme, expanded?.badge || {}),
        content: createContentStyles(theme, expanded?.content || {}),
        icon: createIconStyles(theme, expanded?.icon || {}),
        text: createTextStyles(theme, expanded?.text || {}),
    };
}
