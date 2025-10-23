import { StylesheetStyles } from "../styles";
import { Size } from "../theme/size";

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
 * NOTE: The table stylesheet implementation has been moved to
 * @idealyst/components/src/Table/Table.styles.tsx
 *
 * This was necessary because Unistyles' Babel transform on native cannot resolve
 * function calls to extract variant structures at compile time. The styles must be
 * inlined directly in StyleSheet.create() for variants to work on native.
 */
