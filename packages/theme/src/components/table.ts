import { CompoundVariants, StylesheetStyles } from "../styles";
import { Theme } from "../theme";
import { deepMerge } from "../util/deepMerge";

type TableType = 'default' | 'bordered' | 'striped';
type TableSize = 'sm' | 'md' | 'lg';
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
            borderColor: theme.colors?.border?.primary || '#e0e0e0',
            borderRadius: theme.borderRadius?.md || 8,
            overflow: 'hidden',
            _web: {
                border: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            },
        },
        bordered: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors?.border?.primary || '#e0e0e0',
            borderRadius: theme.borderRadius?.md || 8,
            overflow: 'hidden',
            _web: {
                border: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            },
        },
        striped: {
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: theme.colors?.border?.primary || '#e0e0e0',
            borderRadius: theme.borderRadius?.md || 8,
            overflow: 'hidden',
            _web: {
                border: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
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
            borderBottomColor: theme.colors?.border?.primary || '#e0e0e0',
            _web: {
                borderBottom: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
            },
        },
        striped: {
            borderBottomWidth: 1,
            borderBottomStyle: 'solid',
            borderBottomColor: theme.colors?.border?.primary || '#e0e0e0',
            _web: {
                borderBottom: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
                ':nth-child(even)': {
                    backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
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
                    ':hover': {
                        backgroundColor: theme.colors?.surface?.tertiary || '#e0e0e0',
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
    return {
        sm: {
            padding: theme.spacing?.sm || 8,
            fontSize: 13,
            lineHeight: 18,
        },
        md: {
            padding: theme.spacing?.md || 16,
            fontSize: 14,
            lineHeight: 20,
        },
        lg: {
            padding: theme.spacing?.lg || 24,
            fontSize: 15,
            lineHeight: 22,
        },
    };
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
            borderRightColor: theme.colors?.border?.primary || '#e0e0e0',
            _web: {
                borderRight: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
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
    return {
        sm: {
            padding: theme.spacing?.sm || 8,
            fontSize: 13,
            lineHeight: 18,
        },
        md: {
            padding: theme.spacing?.md || 16,
            fontSize: 14,
            lineHeight: 20,
        },
        lg: {
            padding: theme.spacing?.lg || 24,
            fontSize: 15,
            lineHeight: 22,
        },
    };
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
            borderRightColor: theme.colors?.border?.primary || '#e0e0e0',
            _web: {
                borderRight: `1px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
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
        fontFamily: theme.typography?.fontFamily?.sans,
        _web: {
            borderCollapse: 'collapse',
        },
    }, expanded);
}

const createTheadStyles = (theme: Theme, expanded: Partial<ExpandedTableHeadStyles>): ExpandedTableHeadStyles => {
    return deepMerge({
        backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
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
                        ':hover': {
                            backgroundColor: theme.colors?.surface?.secondary || '#f5f5f5',
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
        fontWeight: theme.typography?.fontWeight?.semibold || '600',
        color: theme.colors?.text?.primary || '#000000',
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors?.border?.primary || '#e0e0e0',
        _web: {
            borderBottom: `2px solid ${theme.colors?.border?.primary || '#e0e0e0'}`,
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
        color: theme.colors?.text?.primary || '#000000',
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
