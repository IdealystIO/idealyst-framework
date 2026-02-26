import type { TextStyle, ViewStyle } from 'react-native';
import type { MarkdownStyles } from 'react-native-markdown-display';
import type { MarkdownStyleOverrides } from '../../Markdown/types';
import type { MarkdownDynamicProps } from '../../Markdown/Markdown.styles';

interface CreateNativeStylesOptions {
  styles: any;
  dynamicProps: MarkdownDynamicProps;
  styleOverrides?: MarkdownStyleOverrides;
}

/**
 * Helper to safely extract style from a dynamic style function.
 * Removes web-only properties like _web, _hover, etc.
 */
function extractStyle(
  styleFn: any,
  dynamicProps: MarkdownDynamicProps
): ViewStyle | TextStyle {
  if (typeof styleFn !== 'function') {
    return {};
  }

  const style = styleFn(dynamicProps);

  if (!style || typeof style !== 'object') {
    return {};
  }

  // Remove web-only and variant properties
  const {
    _web,
    _hover,
    _active,
    _focus,
    variants,
    compoundVariants,
    ...nativeStyle
  } = style;

  return nativeStyle;
}

/**
 * Merges base style with override style.
 */
function mergeStyles(
  base: ViewStyle | TextStyle,
  override?: any
): ViewStyle | TextStyle {
  if (!override) {
    return base;
  }
  return { ...base, ...override };
}

/**
 * Creates a style sheet compatible with react-native-markdown-display
 * from the theme-integrated markdown styles.
 */
export function createNativeStyles({
  styles,
  dynamicProps,
  styleOverrides,
}: CreateNativeStylesOptions): MarkdownStyles {
  return {
    // Body/text
    body: mergeStyles(
      extractStyle(styles.body, dynamicProps),
      styleOverrides?.body
    ) as TextStyle,
    text: mergeStyles(
      extractStyle(styles.body, dynamicProps),
      styleOverrides?.body
    ) as TextStyle,
    paragraph: mergeStyles(
      extractStyle(styles.body, dynamicProps),
      styleOverrides?.paragraph
    ) as ViewStyle,

    // Headings
    heading1: mergeStyles(
      extractStyle(styles.heading1, dynamicProps),
      styleOverrides?.heading1
    ) as TextStyle,
    heading2: mergeStyles(
      extractStyle(styles.heading2, dynamicProps),
      styleOverrides?.heading2
    ) as TextStyle,
    heading3: mergeStyles(
      extractStyle(styles.heading3, dynamicProps),
      styleOverrides?.heading3
    ) as TextStyle,
    heading4: mergeStyles(
      extractStyle(styles.heading4, dynamicProps),
      styleOverrides?.heading4
    ) as TextStyle,
    heading5: mergeStyles(
      extractStyle(styles.heading5, dynamicProps),
      styleOverrides?.heading5
    ) as TextStyle,
    heading6: mergeStyles(
      extractStyle(styles.heading6, dynamicProps),
      styleOverrides?.heading6
    ) as TextStyle,

    // Horizontal rule
    hr: mergeStyles(
      extractStyle(styles.hr, dynamicProps),
      styleOverrides?.hr
    ) as ViewStyle,

    // Emphasis
    strong: mergeStyles(
      extractStyle(styles.strong, dynamicProps),
      styleOverrides?.strong
    ) as TextStyle,
    em: mergeStyles(
      extractStyle(styles.em, dynamicProps),
      styleOverrides?.em
    ) as TextStyle,
    s: mergeStyles(
      extractStyle(styles.strikethrough, dynamicProps),
      styleOverrides?.strikethrough
    ) as TextStyle,

    // Blockquote
    blockquote: mergeStyles(
      extractStyle(styles.blockquote, dynamicProps),
      styleOverrides?.blockquote
    ) as ViewStyle,

    // Lists
    bullet_list: mergeStyles(
      extractStyle(styles.listUnordered, dynamicProps),
      styleOverrides?.listUnordered
    ) as ViewStyle,
    ordered_list: mergeStyles(
      extractStyle(styles.listOrdered, dynamicProps),
      styleOverrides?.listOrdered
    ) as ViewStyle,
    list_item: mergeStyles(
      extractStyle(styles.listItem, dynamicProps),
      styleOverrides?.listItem
    ) as ViewStyle,
    bullet_list_icon: mergeStyles(
      { marginLeft: 8, ...extractStyle(styles.listItemBullet, dynamicProps) },
      styleOverrides?.listItemBullet
    ) as TextStyle,
    bullet_list_content: mergeStyles(
      extractStyle(styles.listItemContent, dynamicProps),
      styleOverrides?.listItemContent
    ) as ViewStyle,
    ordered_list_icon: mergeStyles(
      { marginLeft: 8, ...extractStyle(styles.listItemBullet, dynamicProps) },
      styleOverrides?.listItemBullet
    ) as TextStyle,
    ordered_list_content: mergeStyles(
      extractStyle(styles.listItemContent, dynamicProps),
      styleOverrides?.listItemContent
    ) as ViewStyle,

    // Code
    code_inline: mergeStyles(
      extractStyle(styles.codeInline, dynamicProps),
      styleOverrides?.codeInline
    ) as TextStyle,
    code_block: mergeStyles(
      extractStyle(styles.codeBlock, dynamicProps),
      styleOverrides?.codeBlock
    ) as ViewStyle,
    fence: mergeStyles(
      extractStyle(styles.codeBlock, dynamicProps),
      styleOverrides?.codeBlock
    ) as ViewStyle,
    pre: mergeStyles(
      extractStyle(styles.codeBlock, dynamicProps),
      styleOverrides?.codeBlock
    ) as ViewStyle,

    // Table
    table: mergeStyles(
      extractStyle(styles.table, dynamicProps),
      styleOverrides?.table
    ) as ViewStyle,
    thead: mergeStyles(
      extractStyle(styles.tableHead, dynamicProps),
      styleOverrides?.tableHead
    ) as ViewStyle,
    tbody: {} as ViewStyle,
    tr: mergeStyles(
      extractStyle(styles.tableRow, dynamicProps),
      styleOverrides?.tableRow
    ) as ViewStyle,
    th: mergeStyles(
      extractStyle(styles.tableHeaderCell, dynamicProps),
      styleOverrides?.tableCell
    ) as TextStyle,
    td: mergeStyles(
      extractStyle(styles.tableCell, dynamicProps),
      styleOverrides?.tableCell
    ) as TextStyle,

    // Link
    link: mergeStyles(
      extractStyle(styles.link, dynamicProps),
      styleOverrides?.link
    ) as TextStyle,
    blocklink: {} as ViewStyle,

    // Image
    image: mergeStyles(
      extractStyle(styles.image, dynamicProps),
      styleOverrides?.image
    ) as ViewStyle,

    // Other
    textgroup: {} as ViewStyle,
    hardbreak: {} as ViewStyle,
    softbreak: {} as ViewStyle,
    inline: {} as ViewStyle,
    span: {} as ViewStyle,
  };
}
