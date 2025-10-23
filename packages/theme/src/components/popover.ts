import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

type PopoverPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';

type PopoverVariants = {
    placement: PopoverPlacement;
}

export type ExpandedPopoverStyles = StylesheetStyles<keyof PopoverVariants>;

export type PopoverStylesheet = {
    container: ExpandedPopoverStyles;
    content: ExpandedPopoverStyles;
    arrow: ExpandedPopoverStyles;
    backdrop: ExpandedPopoverStyles;
}

/**
 * Create placement variants for arrow
 */
function createArrowPlacementVariants(theme: Theme) {
    return {
        top: {
            bottom: -6,
            _web: {
                left: '50%',
                marginLeft: -6,
            },
        },
        'top-start': {
            bottom: -6,
            left: 16,
        },
        'top-end': {
            bottom: -6,
            right: 16,
        },
        bottom: {
            top: -6,
            _web: {
                left: '50%',
                marginLeft: -6,
            },
        },
        'bottom-start': {
            top: -6,
            left: 16,
        },
        'bottom-end': {
            top: -6,
            right: 16,
        },
        left: {
            right: -6,
            _web: {
                top: '50%',
                marginTop: -6,
            },
        },
        'left-start': {
            right: -6,
            top: 16,
        },
        'left-end': {
            right: -6,
            bottom: 16,
        },
        right: {
            left: -6,
            _web: {
                top: '50%',
                marginTop: -6,
            },
        },
        'right-start': {
            left: -6,
            top: 16,
        },
        'right-end': {
            left: -6,
            bottom: 16,
        },
    };
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedPopoverStyles>): ExpandedPopoverStyles => {
    return deepMerge({
        backgroundColor: theme.colors.surface.primary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
        borderStyle: 'solid',
        // Native shadows
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        _web: {
            border: `1px solid ${theme.colors.border.primary}`,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'opacity 150ms ease-out, transform 150ms ease-out',
            transformOrigin: 'center center',
        },
    }, expanded);
}

const createContentStyles = (theme: Theme, expanded: Partial<ExpandedPopoverStyles>): ExpandedPopoverStyles => {
    return deepMerge({
        padding: 16,
    }, expanded);
}

const createArrowStyles = (theme: Theme, expanded: Partial<ExpandedPopoverStyles>): ExpandedPopoverStyles => {
    return deepMerge({
        position: 'absolute',
        width: 12,
        height: 12,
        backgroundColor: theme.colors.surface.primary,
        variants: {
            placement: createArrowPlacementVariants(theme),
        },
        _web: {
            transform: 'rotate(45deg)',
            boxShadow: '-2px 2px 4px rgba(0, 0, 0, 0.1)',
        },
    }, expanded);
}

const createBackdropStyles = (theme: Theme, expanded: Partial<ExpandedPopoverStyles>): ExpandedPopoverStyles => {
    return deepMerge({
        flex: 1,
        backgroundColor: 'transparent',
    }, expanded);
}

export const createPopoverStylesheet = (theme: Theme, expanded?: Partial<PopoverStylesheet>): PopoverStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        content: createContentStyles(theme, expanded?.content || {}),
        arrow: createArrowStyles(theme, expanded?.arrow || {}),
        backdrop: createBackdropStyles(theme, expanded?.backdrop || {}),
    };
}
