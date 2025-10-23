import { StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

type DialogSize = 'sm' | 'md' | 'lg' | 'fullscreen';
type DialogType = 'default' | 'alert' | 'confirmation';

type DialogVariants = {
    size: DialogSize;
    type: DialogType;
}

export type ExpandedDialogStyles = StylesheetStyles<keyof DialogVariants>;

export type DialogStylesheet = {
    backdrop: ExpandedDialogStyles;
    container: ExpandedDialogStyles;
    header: ExpandedDialogStyles;
    title: ExpandedDialogStyles;
    closeButton: ExpandedDialogStyles;
    closeButtonText: ExpandedDialogStyles;
    content: ExpandedDialogStyles;
    modal: ExpandedDialogStyles;
}

/**
 * Create size variants for container
 */
function createContainerSizeVariants() {
    return {
        sm: {
            width: '90%',
            maxWidth: 400,
        },
        md: {
            width: '90%',
            maxWidth: 600,
        },
        lg: {
            width: '90%',
            maxWidth: 800,
        },
        fullscreen: {
            width: '100%',
            height: '100%',
            borderRadius: 0,
            maxHeight: '100%',
        },
    };
}

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        default: {},
        alert: {
            borderTopWidth: 4,
            borderTopColor: theme.colors.border.primary,
        },
        confirmation: {
            borderTopWidth: 4,
            borderTopColor: theme.colors.border.primary,
        },
    };
}

const createBackdropStyles = (theme: Theme, expanded: Partial<ExpandedDialogStyles>): ExpandedDialogStyles => {
    return deepMerge({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        _web: {
            position: 'fixed',
            transition: 'opacity 150ms ease-out',
        },
    }, expanded);
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedDialogStyles>): ExpandedDialogStyles => {
    return deepMerge({
        backgroundColor: theme.colors.surface.primary,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
        maxHeight: '90%',
        variants: {
            size: createContainerSizeVariants(),
            type: createContainerTypeVariants(theme),
        },
        _web: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transition: 'opacity 150ms ease-out, transform 150ms ease-out',
            transformOrigin: 'center center',
        },
    }, expanded);
}

const createHeaderStyles = (theme: Theme, expanded: Partial<ExpandedDialogStyles>): ExpandedDialogStyles => {
    return deepMerge({
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        _web: {
            borderBottomStyle: 'solid',
        },
    }, expanded);
}

const createTitleStyles = (theme: Theme, expanded: Partial<ExpandedDialogStyles>): ExpandedDialogStyles => {
    return deepMerge({
        marginLeft: 24,
        fontSize: 18,
        paddingVertical: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
        flex: 1,
        _web: {
            paddingVertical: 4,
        },
    }, expanded);
}

const createCloseButtonStyles = (theme: Theme, expanded: Partial<ExpandedDialogStyles>): ExpandedDialogStyles => {
    return deepMerge({
        width: 32,
        height: 32,
        marginRight: 16,
        borderRadius: 16,
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        _web: {
            border: 'none',
            cursor: 'pointer',
            _hover: {
                backgroundColor: theme.colors.surface.secondary,
            },
        },
    }, expanded);
}

const createCloseButtonTextStyles = (theme: Theme, expanded: Partial<ExpandedDialogStyles>): ExpandedDialogStyles => {
    return deepMerge({
        fontSize: 18,
        color: theme.colors.text.secondary,
        fontWeight: '500',
    }, expanded);
}

const createContentStyles = (theme: Theme, expanded: Partial<ExpandedDialogStyles>): ExpandedDialogStyles => {
    return deepMerge({
        padding: 24,
        _web: {
            overflow: 'visible',
            maxHeight: 'none',
        },
    }, expanded);
}

const createModalStyles = (theme: Theme, expanded: Partial<ExpandedDialogStyles>): ExpandedDialogStyles => {
    return deepMerge({
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }, expanded);
}

export const createDialogStylesheet = (theme: Theme, expanded?: Partial<DialogStylesheet>): DialogStylesheet => {
    return {
        backdrop: createBackdropStyles(theme, expanded?.backdrop || {}),
        container: createContainerStyles(theme, expanded?.container || {}),
        header: createHeaderStyles(theme, expanded?.header || {}),
        title: createTitleStyles(theme, expanded?.title || {}),
        closeButton: createCloseButtonStyles(theme, expanded?.closeButton || {}),
        closeButtonText: createCloseButtonTextStyles(theme, expanded?.closeButtonText || {}),
        content: createContentStyles(theme, expanded?.content || {}),
        modal: createModalStyles(theme, expanded?.modal || {}),
    };
}
