/**
 * Table styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type TableType = 'standard' | 'striped';
type CellAlign = 'left' | 'center' | 'right';

export type TableDynamicProps = {
    size?: Size;
    type?: TableType;
    clickable?: boolean;
    dividers?: boolean;
    even?: boolean;
    sticky?: boolean;
    align?: CellAlign;
    sortable?: boolean;
    sortActive?: boolean;
    gap?: ViewStyleSize;
    padding?: ViewStyleSize;
    paddingVertical?: ViewStyleSize;
    paddingHorizontal?: ViewStyleSize;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * Table styles with type/size handling.
 */
export const tableStyles = defineStyle('Table', (theme: Theme) => ({
    container: ({ type: _type = 'standard' }: TableDynamicProps) => ({
        width: '100%',
        borderWidth: 1,
        borderStyle: 'solid' as const,
        borderColor: theme.colors.border.primary,
        borderRadius: 8,
        overflow: 'hidden' as const,
        variants: {
            gap: {
                gap: theme.sizes.$view.padding,
            },
            padding: {
                padding: theme.sizes.$view.padding,
            },
            paddingVertical: {
                paddingVertical: theme.sizes.$view.padding,
            },
            paddingHorizontal: {
                paddingHorizontal: theme.sizes.$view.padding,
            },
            margin: {
                margin: theme.sizes.$view.padding,
            },
            marginVertical: {
                marginVertical: theme.sizes.$view.padding,
            },
            marginHorizontal: {
                marginHorizontal: theme.sizes.$view.padding,
            },
        },
        _web: {
            overflow: 'auto',
            border: `1px solid ${theme.colors.border.primary}`,
        },
    }),

    table: (_props: TableDynamicProps) => ({
        width: '100%',
        _web: {
            borderCollapse: 'collapse',
        },
    }),

    thead: ({ sticky = false }: TableDynamicProps) => ({
        backgroundColor: theme.colors.surface.secondary,
        _web: sticky ? {
            position: 'sticky' as const,
            top: 0,
            zIndex: 10,
        } : {},
    }),

    tbody: (_props: TableDynamicProps) => ({}),

    tfoot: (_props: TableDynamicProps) => ({
        backgroundColor: theme.colors.surface.secondary,
    }),

    footerCell: (_props: TableDynamicProps) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        color: theme.colors.text.primary,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.primary,
        variants: {
            align: {
                left: { textAlign: 'left' as const, justifyContent: 'flex-start' as const },
                center: { textAlign: 'center' as const, justifyContent: 'center' as const },
                right: { textAlign: 'right' as const, justifyContent: 'flex-end' as const },
            },
            size: {
                paddingVertical: theme.sizes.$table.headerPadding,
                paddingHorizontal: theme.sizes.$table.padding,
                fontSize: theme.sizes.$table.fontSize,
                lineHeight: theme.sizes.$table.lineHeight,
            },
        },
        _web: {
            borderTop: `1px solid ${theme.colors.border.primary}`,
        },
    }),

    row: (_props: TableDynamicProps) => ({
        variants: {
            type: {
                striped: {
                    _web: {
                        ':nth-child(even)': {
                            backgroundColor: theme.colors.surface.secondary,
                        },
                    },
                },
            },
            clickable: {
                true: { _web: { cursor: 'pointer' } },
            },
            dividers: {
                true: {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border.primary,
                    _web: {
                        borderBottom: `1px solid ${theme.colors.border.primary}`,
                    },
                },
            },
        },
        compoundVariants: [
            {
                type: 'striped',
                even: true,
                styles: {
                    backgroundColor: theme.colors.surface.secondary,
                },
            },
        ],
        _web: {
            transition: 'background-color 0.15s ease',
            _hover: {
                backgroundColor: theme.colors.surface.hover,
            },
        },
    }),

    headerCell: (_props: TableDynamicProps) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        fontWeight: '500' as const,
        color: theme.colors.text.secondary,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
        variants: {
            align: {
                left: { textAlign: 'left' as const, justifyContent: 'flex-start' as const },
                center: { textAlign: 'center' as const, justifyContent: 'center' as const },
                right: { textAlign: 'right' as const, justifyContent: 'flex-end' as const },
            },
            size: {
                paddingVertical: theme.sizes.$table.headerPadding,
                paddingHorizontal: theme.sizes.$table.padding,
                fontSize: theme.sizes.$table.fontSize,
                lineHeight: theme.sizes.$table.lineHeight,
            },
            sortable: {
                true: {
                    _web: {
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'background-color 0.15s ease',
                        _hover: {
                            backgroundColor: theme.colors.surface.hover,
                        },
                    },
                },
            },
        },
        _web: {
            position: 'relative',
            borderBottom: `1px solid ${theme.colors.border.primary}`,
        },
    }),

    sortIndicator: ({ sortActive = false }: TableDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginLeft: 4,
        opacity: sortActive ? 1 : 0.4,
        color: sortActive ? theme.colors.text.primary : theme.colors.text.tertiary,
        flexShrink: 0,
        _web: {
            transition: 'opacity 0.15s ease, color 0.15s ease',
        },
        variants: {
            size: {
                width: theme.sizes.$table.fontSize,
                height: theme.sizes.$table.fontSize,
            },
        },
    }),

    optionsButton: (_props: TableDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginLeft: 4,
        borderRadius: 4,
        padding: 2,
        opacity: 0.4,
        flexShrink: 0,
        color: theme.colors.text.tertiary,
        _web: {
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
            transition: 'opacity 0.15s ease, background-color 0.15s ease',
            _hover: {
                opacity: 1,
                backgroundColor: theme.colors.surface.hover,
            },
        },
        variants: {
            size: {
                width: theme.sizes.$table.fontSize,
                height: theme.sizes.$table.fontSize,
            },
        },
    }),

    cell: (_props: TableDynamicProps) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        color: theme.colors.text.primary,
        variants: {
            align: {
                left: { textAlign: 'left' as const, justifyContent: 'flex-start' as const },
                center: { textAlign: 'center' as const, justifyContent: 'center' as const },
                right: { textAlign: 'right' as const, justifyContent: 'flex-end' as const },
            },
            size: {
                padding: theme.sizes.$table.padding,
                fontSize: theme.sizes.$table.fontSize,
                lineHeight: theme.sizes.$table.lineHeight,
            },
        },
    }),
}));
