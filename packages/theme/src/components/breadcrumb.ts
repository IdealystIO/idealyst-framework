import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

type BreadcrumbSize = 'sm' | 'md' | 'lg';
type BreadcrumbIntent = 'primary' | 'neutral';

type BreadcrumbVariants = {
    size: BreadcrumbSize;
    intent: BreadcrumbIntent;
    disabled: boolean;
    isLast: boolean;
    clickable: boolean;
}

export type ExpandedBreadcrumbStyles = StylesheetStyles<keyof BreadcrumbVariants>;

export type BreadcrumbStylesheet = {
    container: ExpandedBreadcrumbStyles;
    item: ExpandedBreadcrumbStyles;
    itemText: ExpandedBreadcrumbStyles;
    icon: ExpandedBreadcrumbStyles;
    separator: ExpandedBreadcrumbStyles;
    ellipsis: ExpandedBreadcrumbStyles;
    ellipsisIcon: ExpandedBreadcrumbStyles;
    menuButton: ExpandedBreadcrumbStyles;
    menuButtonIcon: ExpandedBreadcrumbStyles;
}

/**
 * Create size variants for item text
 */
function createItemTextSizeVariants() {
    return {
        sm: { fontSize: 12, lineHeight: 16 },
        md: { fontSize: 14, lineHeight: 20 },
        lg: { fontSize: 16, lineHeight: 24 },
    };
}

/**
 * Create compound variants for item text
 */
function createItemTextCompoundVariants(theme: Theme): CompoundVariants<keyof BreadcrumbVariants> {
    return [
        {
            clickable: true,
            intent: 'primary',
            isLast: false,
            disabled: false,
            styles: { color: theme.intents.primary.primary },
        },
        {
            clickable: true,
            intent: 'neutral',
            isLast: false,
            disabled: false,
            styles: { color: theme.colors?.text?.secondary || '#666666' },
        },
        {
            clickable: false,
            isLast: false,
            disabled: false,
            styles: { color: theme.colors?.text?.secondary || '#666666' },
        },
    ];
}

/**
 * Create size variants for icons
 */
function createIconSizeVariants() {
    return {
        sm: { width: 14, height: 14 },
        md: { width: 16, height: 16 },
        lg: { width: 18, height: 18 },
    };
}

/**
 * Create intent variants for ellipsis/menu icons
 */
function createIconIntentVariants(theme: Theme) {
    return {
        primary: { color: theme.intents.primary.primary },
        neutral: { color: theme.colors?.text?.secondary || '#666666' },
    };
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    }, expanded);
}

const createItemStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    }, expanded);
}

const createItemTextStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        fontFamily: theme.typography?.fontFamily?.sans,
        variants: {
            size: createItemTextSizeVariants(),
            intent: { primary: {}, neutral: {} },
            disabled: {
                true: {
                    opacity: 0.5,
                    color: theme.colors?.text?.secondary || '#666666',
                },
                false: {},
            },
            isLast: {
                true: { color: theme.colors?.text?.primary || '#000000' },
                false: {},
            },
            clickable: { true: {}, false: {} },
        },
        compoundVariants: createItemTextCompoundVariants(theme),
    }, expanded);
}

const createIconStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        variants: {
            size: createIconSizeVariants(),
        },
    }, expanded);
}

const createSeparatorStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        fontFamily: theme.typography?.fontFamily?.sans,
        color: theme.colors?.text?.tertiary || '#999999',
        variants: {
            size: {
                sm: { fontSize: 12, lineHeight: 16 },
                md: { fontSize: 14, lineHeight: 20 },
                lg: { fontSize: 16, lineHeight: 24 },
            },
        },
    }, expanded);
}

const createEllipsisStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }, expanded);
}

const createEllipsisIconStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        variants: {
            size: createIconSizeVariants(),
            intent: createIconIntentVariants(theme),
        },
    }, expanded);
}

const createMenuButtonStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        paddingVertical: 4,
        paddingHorizontal: 8,
    }, expanded);
}

const createMenuButtonIconStyles = (theme: Theme, expanded: Partial<ExpandedBreadcrumbStyles>): ExpandedBreadcrumbStyles => {
    return deepMerge({
        variants: {
            size: createIconSizeVariants(),
            intent: createIconIntentVariants(theme),
        },
    }, expanded);
}

export const createBreadcrumbStylesheet = (theme: Theme, expanded?: Partial<BreadcrumbStylesheet>): BreadcrumbStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        item: createItemStyles(theme, expanded?.item || {}),
        itemText: createItemTextStyles(theme, expanded?.itemText || {}),
        icon: createIconStyles(theme, expanded?.icon || {}),
        separator: createSeparatorStyles(theme, expanded?.separator || {}),
        ellipsis: createEllipsisStyles(theme, expanded?.ellipsis || {}),
        ellipsisIcon: createEllipsisIconStyles(theme, expanded?.ellipsisIcon || {}),
        menuButton: createMenuButtonStyles(theme, expanded?.menuButton || {}),
        menuButtonIcon: createMenuButtonIconStyles(theme, expanded?.menuButtonIcon || {}),
    };
}
