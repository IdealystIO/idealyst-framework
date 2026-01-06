import { StyleSheet } from 'react-native-unistyles';
import { Theme, StylesheetStyles, CompoundVariants, Size } from '@idealyst/theme';
import { buildSizeVariants } from '../utils/buildSizeVariants';
import {
  buildGapVariants,
  buildPaddingVariants,
  buildPaddingVerticalVariants,
  buildPaddingHorizontalVariants,
  buildMarginVariants,
  buildMarginVerticalVariants,
  buildMarginHorizontalVariants,
} from '../utils/buildViewStyleVariants';
import { applyExtensions } from '../extensions/applyExtension';

type TableType = 'default' | 'bordered' | 'striped';

type TableRowVariants = {
    type: TableType;
    clickable: boolean;
}
/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        standard: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
            overflow: 'hidden',
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
        bordered: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
            overflow: 'hidden',
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
        striped: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
            overflow: 'hidden',
            _web: {
                border: `1px solid ${theme.colors.border.primary}`,
            },
        },
    } as const;
}

/**
 * Create type variants for row
 */
function createRowTypeVariants(theme: Theme) {
    return {
        standard: {},
        bordered: {
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: theme.colors.border.primary,
            _web: {
                borderBottom: `1px solid ${theme.colors.border.primary}`,
            },
        },
        striped: {
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: theme.colors.border.primary,
            _web: {
                borderBottom: `1px solid ${theme.colors.border.primary}`,
                ':nth-child(even)': {
                    backgroundColor: theme.colors.surface.secondary,
                },
            },
        },
    } as const;
}

/**
 * Create compound variants for row
 */
function createRowCompoundVariants(theme: Theme): CompoundVariants<keyof TableRowVariants> {
    return [
        {
            type: 'striped',
            clickable: true,
            styles: {
                _web: {
                    _hover: {
                        backgroundColor: theme.colors.surface.tertiary,
                    },
                },
            },
        },
    ] as const;
}

/**
 * Create size variants for header cell
 */
function createHeaderCellSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'table', (size) => ({
        padding: size.padding,
        fontSize: size.fontSize,
        lineHeight: size.lineHeight,
    }));
}

/**
 * Create type variants for header cell
 */
function createHeaderCellTypeVariants(theme: Theme) {
    return {
        standard: {},
        bordered: {
            borderRightWidth: 1,
            borderRightStyle: 'solid',
            borderRightColor: theme.colors.border.primary,
            _web: {
                borderRight: `1px solid ${theme.colors.border.primary}`,
                ':last-child': {
                    borderRight: 'none',
                },
            },
        },
        striped: {},
    } as const;
}

/**
 * Create size variants for cell
 */
function createCellSizeVariants(theme: Theme) {
    return buildSizeVariants(theme, 'table', (size) => ({
        padding: size.padding,
        fontSize: size.fontSize,
        lineHeight: size.lineHeight,
    }));
}

/**
 * Create type variants for cell
 */
function createCellTypeVariants(theme: Theme) {
    return {
        standard: {},
        bordered: {
            borderRightWidth: 1,
            borderRightStyle: 'solid',
            borderRightColor: theme.colors.border.primary,
            _web: {
                borderRight: `1px solid ${theme.colors.border.primary}`,
                ':last-child': {
                    borderRight: 'none',
                },
            },
        },
        striped: {},
    } as const;
}

function createContainerStyles(theme: Theme) {
    return () => ({
        width: '100%',
        _web: {
            overflow: 'auto',
        },
        variants: {
            type: createContainerTypeVariants(theme),
            // Spacing variants from ContainerStyleProps
            gap: buildGapVariants(theme),
            padding: buildPaddingVariants(theme),
            paddingVertical: buildPaddingVerticalVariants(theme),
            paddingHorizontal: buildPaddingHorizontalVariants(theme),
            margin: buildMarginVariants(theme),
            marginVertical: buildMarginVerticalVariants(theme),
            marginHorizontal: buildMarginHorizontalVariants(theme),
        },
    });
}

const createTableStyles = (theme: Theme) => {
    return {
        width: '100%',
        _web: {
            borderCollapse: 'collapse',
        },
    } as const;
}

const createTheadStyles = (theme: Theme) => {
    return {
        backgroundColor: theme.colors.surface.secondary,
        variants: {
            sticky: {
                true: {
                    _web: {
                            position: 'sticky',
                            top: 0,
                            zIndex: 10,
                    }
                },
                false: {},
            },
        },
    } as const;
}

const createRowStyles = (theme: Theme) => {
    return {
        variants: {
            type: createRowTypeVariants(theme),
            clickable: {
                true: {
                    _web: {
                        cursor: 'pointer',
                        _hover: {
                            backgroundColor: theme.colors.surface.secondary,
                        },
                    },
                },
                false: {},
            },
        },
        compoundVariants: createRowCompoundVariants(theme),
        _web: {
            transition: 'background-color 0.2s ease',
        },
    } as const;
}

const createHeaderCellStyles = (theme: Theme) => {
    return {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'left',
        fontWeight: '600',
        color: theme.colors.text.primary,
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors.border.primary,
        _web: {
            borderBottom: `2px solid ${theme.colors.border.primary}`,
        },
        variants: {
            size: createHeaderCellSizeVariants(theme),
            align: {
                left: {
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                },
                center: {
                    textAlign: 'center',
                    justifyContent: 'center',
                },
                right: {
                    textAlign: 'right',
                    justifyContent: 'flex-end',
                },
            },
            type: createHeaderCellTypeVariants(theme),
        },
    } as const;
}

const createCellStyles = (theme: Theme) => {
    return {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'left',
        color: theme.colors.text.primary,
        variants: {
            size: createCellSizeVariants(theme),
            align: {
                left: {
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                },
                center: {
                    textAlign: 'center',
                    justifyContent: 'center',
                },
                right: {
                    textAlign: 'right',
                    justifyContent: 'flex-end',
                },
            },
            type: createCellTypeVariants(theme),
        },
    } as const;
}

export const tableStyles = StyleSheet.create((theme: Theme) => {
    // Apply extensions to main visual elements
    const extended = applyExtensions('Table', theme, {
        container: createContainerStyles(theme),
    });

    return {
        ...extended,
        // Minor utility styles (not extended)
        table: createTableStyles(theme),
        thead: createTheadStyles(theme),
        tbody: {},
        row: createRowStyles(theme),
        headerCell: createHeaderCellStyles(theme),
        cell: createCellStyles(theme),
    } as const;
});
