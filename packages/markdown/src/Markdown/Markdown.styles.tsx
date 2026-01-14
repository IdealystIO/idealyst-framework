/**
 * Markdown styles using defineStyle with theme integration.
 *
 * Provides consistent styling for all markdown elements that
 * integrates with the Idealyst theme system.
 */
import { StyleSheet } from 'react-native-unistyles';
import { defineStyle, ThemeStyleWrapper } from '@idealyst/theme';
import type { Theme as BaseTheme, Intent, Size } from '@idealyst/theme';

// Required: Unistyles must see StyleSheet usage in original source to process this file
void StyleSheet;

// Wrap theme for $iterator support
type Theme = ThemeStyleWrapper<BaseTheme>;

export type MarkdownVariants = {
  size: Size;
  linkIntent: Intent;
};

/**
 * Dynamic props passed to markdown style functions.
 */
export type MarkdownDynamicProps = {
  linkIntent?: Intent;
  size?: Size;
};

/**
 * Markdown styles with theme integration.
 *
 * All elements use theme colors, typography, and spacing
 * for consistent styling across the application.
 */
// @ts-expect-error - Markdown is not in the ComponentName union yet
export const markdownStyles = defineStyle('Markdown', (theme: Theme) => ({
  // Container
  container: (_props: MarkdownDynamicProps) => ({
    flexShrink: 1,
  }),

  // Body/paragraph text - uses theme typography
  body: (_props: MarkdownDynamicProps) => ({
    color: theme.colors.text.primary,
    marginVertical: 8,
    fontSize: theme.sizes.typography.body1.fontSize,
    lineHeight: theme.sizes.typography.body1.lineHeight,
  }),

  // Headings - use theme typography for each level
  heading1: (_props: MarkdownDynamicProps) => ({
    color: theme.colors.text.primary,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
    fontSize: theme.sizes.typography.h1.fontSize,
    lineHeight: theme.sizes.typography.h1.lineHeight,
  }),

  heading2: (_props: MarkdownDynamicProps) => ({
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    paddingBottom: 8,
    fontSize: theme.sizes.typography.h2.fontSize,
    lineHeight: theme.sizes.typography.h2.lineHeight,
  }),

  heading3: (_props: MarkdownDynamicProps) => ({
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    fontSize: theme.sizes.typography.h3.fontSize,
    lineHeight: theme.sizes.typography.h3.lineHeight,
  }),

  heading4: (_props: MarkdownDynamicProps) => ({
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    fontSize: theme.sizes.typography.h4.fontSize,
    lineHeight: theme.sizes.typography.h4.lineHeight,
  }),

  heading5: (_props: MarkdownDynamicProps) => ({
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
    fontSize: theme.sizes.typography.h5.fontSize,
    lineHeight: theme.sizes.typography.h5.lineHeight,
  }),

  heading6: (_props: MarkdownDynamicProps) => ({
    color: theme.colors.text.secondary,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
    fontSize: theme.sizes.typography.h6.fontSize,
    lineHeight: theme.sizes.typography.h6.lineHeight,
  }),

  // Emphasis
  strong: (_props: MarkdownDynamicProps) => ({
    fontWeight: '700',
  }),

  em: (_props: MarkdownDynamicProps) => ({
    fontStyle: 'italic',
  }),

  strikethrough: (_props: MarkdownDynamicProps) => ({
    textDecorationLine: 'line-through',
    color: theme.colors.text.tertiary,
  }),

  // Links
  link: ({ linkIntent = 'primary' }: MarkdownDynamicProps) => ({
    color: theme.intents?.[linkIntent]?.primary ?? theme.colors.text.primary,
    textDecorationLine: 'underline',
    _web: {
      cursor: 'pointer',
      transition: 'color 0.15s ease',
      _hover: {
        opacity: 0.8,
      },
    },
  }),

  // Blockquote
  blockquote: (_props: MarkdownDynamicProps) => ({
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.border.secondary,
    paddingLeft: 16,
    paddingVertical: 8,
    marginVertical: 12,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radii.sm,
  }),

  blockquoteText: (_props: MarkdownDynamicProps) => ({
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  }),

  // Code inline
  codeInline: (_props: MarkdownDynamicProps) => ({
    fontFamily: 'monospace',
    backgroundColor: theme.colors.surface.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radii.xs,
    color: theme.colors.text.primary,
    fontSize: theme.sizes.typography.caption.fontSize,
  }),

  // Code block
  codeBlock: (_props: MarkdownDynamicProps) => ({
    fontFamily: 'monospace',
    backgroundColor: theme.colors.surface.secondary,
    padding: 16,
    borderRadius: theme.radii.md,
    marginVertical: 12,
    _web: {
      overflow: 'auto' as const,
      maxHeight: 500,
    },
    fontSize: theme.sizes.typography.caption.fontSize,
    lineHeight: theme.sizes.typography.body1.lineHeight,
  }),

  codeBlockText: (_props: MarkdownDynamicProps) => ({
    fontFamily: 'monospace',
    color: theme.colors.text.primary,
  }),

  // Lists
  listOrdered: (_props: MarkdownDynamicProps) => ({
    marginVertical: 8,
    paddingLeft: 24,
  }),

  listUnordered: (_props: MarkdownDynamicProps) => ({
    marginVertical: 8,
    paddingLeft: 24,
  }),

  listItem: (_props: MarkdownDynamicProps) => ({
    marginVertical: 4,
    color: theme.colors.text.primary,
    flexDirection: 'row',
  }),

  listItemBullet: (_props: MarkdownDynamicProps) => ({
    color: theme.colors.text.secondary,
    marginRight: 8,
    width: 16,
  }),

  listItemContent: (_props: MarkdownDynamicProps) => ({
    flex: 1,
  }),

  // Task list
  taskListItem: (_props: MarkdownDynamicProps) => ({
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 4,
  }),

  taskCheckbox: (_props: MarkdownDynamicProps) => ({
    marginTop: 4,
  }),

  // Table
  table: (_props: MarkdownDynamicProps) => ({
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radii.sm,
    marginVertical: 12,
    _web: {
      overflow: 'hidden' as const,
      borderCollapse: 'collapse',
      width: '100%',
    },
  }),

  tableHead: (_props: MarkdownDynamicProps) => ({
    backgroundColor: theme.colors.surface.secondary,
  }),

  tableRow: (_props: MarkdownDynamicProps) => ({
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
    _web: {
      _hover: {
        backgroundColor: theme.colors.surface.secondary,
      },
    },
  }),

  tableCell: (_props: MarkdownDynamicProps) => ({
    padding: 12,
    color: theme.colors.text.primary,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.primary,
    fontSize: theme.sizes.typography.body1.fontSize,
  }),

  tableHeaderCell: (_props: MarkdownDynamicProps) => ({
    padding: 12,
    color: theme.colors.text.primary,
    fontWeight: '600',
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.primary,
    textAlign: 'left',
    fontSize: theme.sizes.typography.body1.fontSize,
  }),

  // Image
  image: (_props: MarkdownDynamicProps) => ({
    maxWidth: '100%',
    borderRadius: theme.radii.sm,
    marginVertical: 8,
  }),

  // Horizontal rule
  hr: (_props: MarkdownDynamicProps) => ({
    height: 1,
    backgroundColor: theme.colors.border.secondary,
    marginVertical: 24,
    borderWidth: 0,
  }),

  // Footnotes
  footnoteContainer: (_props: MarkdownDynamicProps) => ({
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    marginTop: 24,
    paddingTop: 16,
  }),

  footnote: (_props: MarkdownDynamicProps) => ({
    marginVertical: 4,
  }),

  footnoteRef: ({ linkIntent = 'primary' }: MarkdownDynamicProps) => ({
    color: theme.intents?.[linkIntent]?.primary ?? theme.colors.text.primary,
    fontSize: 10,
    _web: {
      verticalAlign: 'super',
      cursor: 'pointer',
    },
  }),
}));
