/**
 * Accordion styles using defineStyle with dynamic props.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Size } from '@idealyst/theme';
import { ViewStyleSize } from '../utils/viewStyleProps';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

type AccordionType = 'standard' | 'separated' | 'bordered';

export type AccordionDynamicProps = {
    size?: Size;
    type?: AccordionType;
    expanded?: boolean;
    disabled?: boolean;
    isLast?: boolean;
    gap?: ViewStyleSize;
    padding?: ViewStyleSize;
    paddingVertical?: ViewStyleSize;
    paddingHorizontal?: ViewStyleSize;
    margin?: ViewStyleSize;
    marginVertical?: ViewStyleSize;
    marginHorizontal?: ViewStyleSize;
};

/**
 * Accordion styles with type/expanded/disabled handling.
 */
export const accordionStyles = defineStyle('Accordion', (theme: Theme) => ({
    container: ({ type = 'standard' }: AccordionDynamicProps) => {
        const typeStyles = type === 'bordered' ? {
            borderWidth: 1,
            borderStyle: 'solid' as const,
            borderColor: theme.colors.border.primary,
            borderRadius: 8,
            overflow: 'hidden' as const,
        } : {};

        return {
            display: 'flex' as const,
            flexDirection: 'column' as const,
            gap: type === 'separated' ? 8 : 0,
            ...typeStyles,
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
        } as const;
    },

    item: ({ type = 'standard', isLast = false }: AccordionDynamicProps) => {
        let typeStyles = {};

        if (type === 'standard' || type === 'bordered') {
            typeStyles = {
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomStyle: 'solid' as const,
                borderBottomColor: theme.colors.border.primary,
            };
        } else if (type === 'separated') {
            typeStyles = {
                borderWidth: 1,
                borderStyle: 'solid' as const,
                borderColor: theme.colors.border.primary,
                borderRadius: 8,
                overflow: 'hidden' as const,
            };
        }

        return {
            display: 'flex' as const,
            flexDirection: 'column' as const,
            ...typeStyles,
        } as const;
    },

    header: ({ expanded = false, disabled = false }: AccordionDynamicProps) => ({
        display: 'flex' as const,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        width: '100%',
        backgroundColor: 'transparent' as const,
        color: theme.colors.text.primary,
        textAlign: 'left' as const,
        fontWeight: expanded ? ('600' as const) : ('500' as const),
        opacity: disabled ? 0.5 : 1,
        variants: {
            size: {
                fontSize: theme.sizes.$accordion.headerFontSize,
                padding: theme.sizes.$accordion.headerPadding,
            },
        },
        _web: {
            appearance: 'none',
            background: 'none',
            border: 'none',
            outline: 'none',
            margin: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
            _hover: disabled ? {} : { backgroundColor: theme.colors.surface.secondary },
        },
    }),

    title: (_props: AccordionDynamicProps) => ({
        flex: 1,
    }),

    icon: ({ expanded = false }: AccordionDynamicProps) => ({
        display: 'flex' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginLeft: 8,
        color: theme.intents.primary.primary,
        variants: {
            size: {
                width: theme.sizes.$accordion.iconSize,
                height: theme.sizes.$accordion.iconSize,
            },
        },
        _web: {
            transition: 'transform 0.2s ease',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        },
    }),

    content: ({ expanded = false }: AccordionDynamicProps) => ({
        overflow: 'hidden' as const,
        maxHeight: expanded ? 2000 : 0,
        _web: {
            transition: 'height 0.15s ease, padding 0.3s ease',
        },
    }),

    contentInner: (_props: AccordionDynamicProps) => ({
        color: theme.colors.text.secondary,
        variants: {
            size: {
                fontSize: theme.sizes.$accordion.headerFontSize,
                padding: theme.sizes.$accordion.contentPadding,
                paddingTop: 0,
            },
        },
    }),
}));
