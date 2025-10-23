import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme, Size } from "../theme";
import { deepMerge } from "../util/deepMerge";
import { buildSizeVariants } from "../variants/size";

type TableType = 'default' | 'bordered' | 'striped';
type TableSize = Size;
type TableAlign = 'left' | 'center' | 'right';

type TableContainerVariants = {
    type: TableType;
}

type TableHeadVariants = {
    sticky: boolean;
}

type TableRowVariants = {
    type: TableType;
    clickable: boolean;
}

type TableHeaderCellVariants = {
    size: TableSize;
    align: TableAlign;
    type: TableType;
}

type TableCellVariants = {
    size: TableSize;
    align: TableAlign;
    type: TableType;
}

export type ExpandedTableContainerStyles = StylesheetStyles<keyof TableContainerVariants>;
export type ExpandedTableHeadStyles = StylesheetStyles<keyof TableHeadVariants>;
export type ExpandedTableRowStyles = StylesheetStyles<keyof TableRowVariants>;
export type ExpandedTableHeaderCellStyles = StylesheetStyles<keyof TableHeaderCellVariants>;
export type ExpandedTableCellStyles = StylesheetStyles<keyof TableCellVariants>;
export type ExpandedTableStyles = StylesheetStyles<never>;

export type TableStylesheet = {
    container: ExpandedTableContainerStyles;
    table: ExpandedTableStyles;
    thead: ExpandedTableHeadStyles;
    tbody: ExpandedTableStyles;
    row: ExpandedTableRowStyles;
    headerCell: ExpandedTableHeaderCellStyles;
    cell: ExpandedTableCellStyles;
}

/**
 * Create type variants for container
 */
function createContainerTypeVariants(theme: Theme) {
    return {
        default: {
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
    };
}

/**
 * Create type variants for row
 */
function createRowTypeVariants(theme: Theme) {
    return {
        default: {},
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
    };
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
    ];
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
        default: {},
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
    };
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
        default: {},
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
    };
}

const createContainerStyles = (theme: Theme, expanded: Partial<ExpandedTableContainerStyles>): ExpandedTableContainerStyles => {
    return deepMerge({
        width: '100%',
        overflow: 'auto',
        variants: {
            type: createContainerTypeVariants(theme),
        },
    }, expanded);
}

const createTableStyles = (theme: Theme, expanded: Partial<ExpandedTableStyles>): ExpandedTableStyles => {
    return deepMerge({
        width: '100%',
        _web: {
            borderCollapse: 'collapse',
        },
    }, expanded);
}

const createTheadStyles = (theme: Theme, expanded: Partial<ExpandedTableHeadStyles>): ExpandedTableHeadStyles => {
    return deepMerge({
        backgroundColor: theme.colors.surface.secondary,
        variants: {
            sticky: {
                true: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                },
                false: {},
            },
        },
    }, expanded);
}

const createTbodyStyles = (theme: Theme, expanded: Partial<ExpandedTableStyles>): ExpandedTableStyles => {
    return deepMerge({}, expanded);
}

const createRowStyles = (theme: Theme, expanded: Partial<ExpandedTableRowStyles>): ExpandedTableRowStyles => {
    return deepMerge({
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
    }, expanded);
}

const createHeaderCellStyles = (theme: Theme, expanded: Partial<ExpandedTableHeaderCellStyles>): ExpandedTableHeaderCellStyles => {
    return deepMerge({
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
                },
                center: {
                    textAlign: 'center',
                },
                right: {
                    textAlign: 'right',
                },
            },
            type: createHeaderCellTypeVariants(theme),
        },
    }, expanded);
}

const createCellStyles = (theme: Theme, expanded: Partial<ExpandedTableCellStyles>): ExpandedTableCellStyles => {
    return deepMerge({
        textAlign: 'left',
        color: theme.colors.text.primary,
        variants: {
            size: createCellSizeVariants(theme),
            align: {
                left: {
                    textAlign: 'left',
                },
                center: {
                    textAlign: 'center',
                },
                right: {
                    textAlign: 'right',
                },
            },
            type: createCellTypeVariants(theme),
        },
    }, expanded);
}

export const createTableStylesheet = (theme: Theme, expanded?: Partial<TableStylesheet>): TableStylesheet => {
    return {
        container: createContainerStyles(theme, expanded?.container || {}),
        table: createTableStyles(theme, expanded?.table || {}),
        thead: createTheadStyles(theme, expanded?.thead || {}),
        tbody: createTbodyStyles(theme, expanded?.tbody || {}),
        row: createRowStyles(theme, expanded?.row || {}),
        headerCell: createHeaderCellStyles(theme, expanded?.headerCell || {}),
        cell: createCellStyles(theme, expanded?.cell || {}),
    };
}
