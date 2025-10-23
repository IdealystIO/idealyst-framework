import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles} from '@idealyst/theme';

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

// Styles are inlined here instead of in @idealyst/theme because Unistyles' Babel
// transform on native cannot resolve function calls to extract variant structures.
// @ts-ignore - TS language server needs restart to pick up theme structure changes
export const popoverStyles = StyleSheet.create((theme: Theme) => {
  return {
    container: {
        backgroundColor: theme.colors.surface.primary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
        borderStyle: 'solid',
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
    },
    content: {
        padding: 16,
    },
    arrow: {
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
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'transparent',
    },
  };
});