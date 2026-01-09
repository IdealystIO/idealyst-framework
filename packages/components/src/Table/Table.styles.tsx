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

type TableType = 'standard' | 'bordered' | 'striped';
type CellAlign = 'left' | 'center' | 'right';

export type TableDynamicProps = {
    size?: Size;
    type?: TableType;
    clickable?: boolean;
    sticky?: boolean;
    align?: CellAlign;
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
    container: ({ type = 'standard' }: TableDynamicProps) => ({
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

    row: ({ type = 'standard', clickable = false }: TableDynamicProps) => {
        const typeStyles = type === 'bordered' || type === 'striped' ? {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border.primary,
        } : {};

        return {
            ...typeStyles,
            _web: {
                transition: 'background-color 0.2s ease',
                borderBottom: (type === 'bordered' || type === 'striped')
                    ? `1px solid ${theme.colors.border.primary}`
                    : undefined,
                cursor: clickable ? 'pointer' : undefined,
                _hover: clickable ? { backgroundColor: theme.colors.surface.secondary } : {},
                // Striped rows handled via CSS pseudo-selector
                ...(type === 'striped' ? {
                    ':nth-child(even)': {
                        backgroundColor: theme.colors.surface.secondary,
                    },
                } : {}),
            },
        } as const;
    },

    headerCell: ({ type = 'standard', align = 'left' }: TableDynamicProps) => ({
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        fontWeight: '600' as const,
        color: theme.colors.text.primary,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.border.primary,
        variants: {
            type: {
                bordered: { borderRightWidth: 1, borderRightColor: theme.colors.border.primary },
            },
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
        _web: {
            borderBottom: `2px solid ${theme.colors.border.primary}`,
            borderRight: type === 'bordered' ? `1px solid ${theme.colors.border.primary}` : undefined,
            ':last-child': type === 'bordered' ? { borderRight: 'none' } : {},
        },
    }),

    cell: ({ type = 'standard', align = 'left' }: TableDynamicProps) => {
        const alignStyles = {
            left: { textAlign: 'left' as const, justifyContent: 'flex-start' as const },
            center: { textAlign: 'center' as const, justifyContent: 'center' as const },
            right: { textAlign: 'right' as const, justifyContent: 'flex-end' as const },
        }[align];

        const borderStyles = type === 'bordered' ? {
            borderRightWidth: 1,
            borderRightColor: theme.colors.border.primary,
        } : {};

        return {
            flexDirection: 'row' as const,
            alignItems: 'center' as const,
            color: theme.colors.text.primary,
            ...alignStyles,
            ...borderStyles,
            variants: {
                size: {
                    padding: theme.sizes.$table.padding,
                    fontSize: theme.sizes.$table.fontSize,
                    lineHeight: theme.sizes.$table.lineHeight,
                },
            },
            _web: {
                borderRight: type === 'bordered' ? `1px solid ${theme.colors.border.primary}` : undefined,
                ':last-child': type === 'bordered' ? { borderRight: 'none' } : {},
            },
        } as const;
    },
}));
